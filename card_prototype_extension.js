load('utils.js');

Card.prototype.getStatus = getStatus

Card.prototype.getResponse = getResponse;
Card.prototype.getAuthenticateResponse = getAuthenticateResponse;
Card.prototype.getInquireAccountResponse = getInquireAccountResponse;
Card.prototype.getSMResponse = getSMResponse;

Card.prototype.inquireAccount = inquireAccount
Card.prototype.credit = credit
Card.prototype.debit = debit
Card.prototype.revokeDebit = revokeDebit

Card.prototype.openFile = openFile;
Card.prototype.presentIC = presentIC;
Card.prototype.startSession = startSession;
Card.prototype.clearCard = clearCard;
Card.prototype.writeRecord = writeRecord;
Card.prototype.readBinary = readBinary;
Card.prototype.writeBinary = writeBinary;

Card.prototype.readRecord = readRecord;
Card.prototype.openMCUIDFile = openMCUIDFile;
Card.prototype.openManufacturerFile = openManufacturerFile;
Card.prototype.openPersonalizationFile = openPersonalizationFile;
Card.prototype.openSecurityFile = openSecurityFile;
Card.prototype.openUserManagFile = openUserManagFile;
Card.prototype.openAccountFile = openAccountFile;
Card.prototype.openAccountSecurityFile = openAccountSecurityFile;
Card.prototype.openATRFile = openATRFile;

Card.prototype.authenticate = authenticate;

Card.prototype.getIsoInSMCommand = getIsoInSMCommand;
Card.prototype.calcMAC = calcMAC;
Card.prototype.revokeLastSMOper = revokeLastSMOper;

// ---------------------------- SEVERAL PURPOSE METHODS

function getIsoInSMCommand(apduCommand, data) {
    var encryptedData = Utils.bytes.encryptCBC(data, this.sessionKey, this.seqNum);
    
    var CLA_ = apduCommand.bytes(0, 1).xor(new ByteString('0C', HEX)); // it should be always 0x8C
    
    var INS = apduCommand.bytes(1, 1);
    var P1 = apduCommand.bytes(2, 1);
    var P2 = apduCommand.bytes(3, 1);
    // P3_ = length + padding => len (0x87, l_87, Pi, Encrypted_data, 0x8E,
    // 0x04, MAC(4 bytes)) => len(enc_data) + 9
    var P3_ = new ByteString('00', HEX).add(encryptedData.length + 9);
    // tag 0x87
    var tag_87 = new ByteString('87', HEX);
    // len_tag_87 var L_87 = len(Pi + encryptedData) => len(encripted_data) + 1
    var L_87 = new ByteString('00', HEX).add(encryptedData.length + 1);
    // Pi => ecryptd data padding indicator => number of padded bytes
    var Pi = new ByteString('00', HEX).add(encryptedData.length - data.length);
    // encData
    // tag 0x8E
    var tag_8E = new ByteString('8E', HEX);
    // length tag 0x8E = 4
    var L_8E = new ByteString('00', HEX).add(4);
    // MAC
    //var MAC = calcMAC();
    
    var macChain = CLA_.concat(INS).concat(P1).concat(P2).concat(tag_87).concat(L_87).concat(Pi).concat(encryptedData)
    var wholeCommand = CLA_.concat(INS).concat(P1).concat(P2).concat(P3_).concat(tag_87).concat(L_87).concat(Pi).concat(encryptedData)
    var MAC = this.calcMAC(macChain);
    wholeCommand = wholeCommand.concat(tag_8E).concat(L_8E).concat(MAC);
    
    this.seqNum = this.seqNum.add(1);
    this.lastSMOper = {
	    CLA_ : CLA_,
	    INS: INS,
	    P1: P1,
	    P2: P2
    }
    
    return wholeCommand
}

function revokeLastSMOper(){
    this.lastSMOper = null;
    this.seqNum = this.seqNum.add(-1);
}

function calcMAC(command, ommitTLV, key, seqNum){
    var seq = seqNum || this.seqNum;
    var k = key || this.sessionKey;
    var mac = new ByteString('', HEX);
    if(! ommitTLV)
	mac = mac.concat(new ByteString('89 04', HEX));
    mac = mac.concat(command);
    mac = Utils.bytes.encryptCBC(mac, k, seq);
    mac = mac.right(8).left(4);
    return mac;
}

TERMINAL_KEY = new ByteString(' AA 00 AA 01 AA 02 AA 03', HEX);
CARD_KEY = new ByteString('DD 00 DD 01 DD 02 DD 03', HEX);

ACCOUNT_KEYS = [
    new ByteString('80 81 82 83 84 85 86 87', HEX),
    new ByteString('90 91 92 93 94 95 96 97', HEX),
    new ByteString('A0 A1 A2 A3 A4 A5 A6 A7', HEX),
    new ByteString('B0 B1 B2 B3 B4 B5 B6 B7', HEX)
];

DEBIT_KEY_NUM = 0;
CREDIT_KEY_NUM = 1;
CERTIFY_KEY_NUM = 2;
REVOKE_DEBIT_NUM = 3;

function authenticate() {
    var response = this.startSession();
    if (response.status !== '9000') {
	print('[ERROR] Error with start session: ' + response.status);
	return false;
    }

    var cardRandom = response.cardRandom;
    cryptedRandom = Utils.bytes.encryptECB(cardRandom, TERMINAL_KEY);
    var terminalrandom = new Crypto().generateRandom(8);

    var authenticateAPDU = new ByteString('80 82 00 00 10', HEX);

    var wholeCommand = authenticateAPDU.concat(cryptedRandom).concat(
	    terminalrandom);
    this.plainApdu(wholeCommand);
    var authStatus = this.getStatus();
    if (authStatus !== '9000') {
	print('[ERROR] error in authenticate command: ' + authStatus);
	return false;
    }

    var sessionKey = Utils.bytes.encryptECB(cardRandom, CARD_KEY).xor(
	    terminalrandom);
    sessionKey = Utils.bytes.encryptECB(sessionKey, TERMINAL_KEY);
    var authResp = this.getAuthenticateResponse();
    if (authResp.status !== '9000') {
	print('[ERROR] error in authenticate response: ' + authResp.status);
	return false;
    }
    var returnResult = Utils.bytes.decryptECB(authResp.data, sessionKey);
    if (!terminalrandom.equals(returnResult)) {
	print('[ERROR] Athentication failed!!!!');
	return false;
    }
    this.sessionKey = sessionKey;
    this.seqNum = cardRandom.and(new ByteString('00 00 00 00 00 00 FF FF', HEX)).add(1);
    return true;

}

function startSession() {
    var resp = this.sendApdu(0x80, 0x84, 0, 0, 8);
    return {
	data : resp,
	cardRandom : resp,
	status : this.getStatus()
    };
}

function presentIC() {
    print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
    resp = this.plainApdu(new ByteString(
	    "80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
    return {
	data : resp,
	status : this.getStatus()
    };
}

function openFile(file) {
    var apduCommand = new ByteString("80 A4 00 00 02", HEX);
    var wholeCommand = apduCommand.concat(new ByteString(file, HEX));
    this.plainApdu(wholeCommand);

    return {
	status : this.getStatus()
    }
}

function readRecord(record, offset, length) {
    var resp = this.sendApdu(0x80, 0xB2, record, offset, length);
    return {
	data : resp,
	status : this.getStatus()
    }
}

function getStatus() {
    return this.SW.toString(16);
}

function startSession() {
    var resp = this.sendApdu(0x80, 0x84, 0x00, 0x00, 0x08);
    return {
	cardRandom : resp,
	status : this.getStatus()
    }
}

function getAuthenticateResponse() {
    var resp = this.getResponse(0x08);
    return {
	data : resp,
	status : this.getStatus()
    }
}

function getSMResponse(){
    var resp = this.getResponse(0xC);
    var status = this.getStatus();
    var commandStatus = resp.bytes(2, 2).toString(HEX);
    var macChain = this.lastSMOper.CLA_.concat(this.lastSMOper.INS).concat(this.lastSMOper.P1).concat(this.lastSMOper.P2).concat(resp.bytes(0, 4));
    var MAC = this.calcMAC(macChain);
    if (! MAC.equals(resp.right(4))){
	print('[ERROR] MAC does not match!!!!');
    }
    this.seqNum = this.seqNum.add(1);
    
    return{
	status: status,
	commandStatus: commandStatus,
    };
    
}

function getResponse(respCode) {
    return this.sendApdu(0x80, 0xC0, 0x00, 0x00, respCode);
}

function clearCard() {
    this.sendApdu(0x80, 0x30, 0x00, 0x00, 0x00);
    return {
	status : this.getStatus()
    }
}

function writeRecord(record, offset, len, bytes, useSM) {
    var apduCommand = new ByteString("80 D2", HEX);
    var recordBS = new ByteString(Utils.numbers.fixedLengthIntString(record
	    .toString(16), 2), HEX);
    var offSetBS = new ByteString(Utils.numbers.fixedLengthIntString(offset
	    .toString(16), 2), HEX);
    var lenBS = new ByteString(Utils.numbers.fixedLengthIntString(len
	    .toString(16), 2), HEX);

    var wholeCommand = apduCommand.concat(recordBS);
    wholeCommand = wholeCommand.concat(offSetBS);
    wholeCommand = wholeCommand.concat(lenBS);
    
    if(useSM)
	wholeCommand = this.getIsoInSMCommand(wholeCommand, bytes);
    else
	wholeCommand = wholeCommand.concat(bytes);
    this.plainApdu(wholeCommand);
    
    if(useSM &&  this.getStatus() !== '9000' && this.getStatus() !== '6882'){
	this.revokeLastSM();
    }

    return {
	status : this.getStatus()
    }
}

function readBinary(highOffset, lowOffset, len) {
    var resp = this.sendApdu(0x80, 0xB0, highOffset, lowOffset, len);
    return {
	data : resp,
	status : this.getStatus()
    }
}

function writeBinary(highOffset, lowOffset, len, bytes) {
    var apduCommand = new ByteString("80 D0", HEX);
    var h_offsetBS = new ByteString(Utils.numbers.fixedLengthIntString(
	    highOffset.toString(16), 2), HEX);
    var l_offsetBS = new ByteString(Utils.numbers.fixedLengthIntString(
	    lowOffset.toString(16), 2), HEX);
    var lenBS = new ByteString(Utils.numbers.fixedLengthIntString(len
	    .toString(16), 2), HEX);

    var wholeCommand = apduCommand.concat(h_offsetBS);
    var wholeCommand = wholeCommand.concat(l_offsetBS);
    var wholeCommand = wholeCommand.concat(lenBS);
    var wholeCommand = wholeCommand.concat(bytes);
    this.plainApdu(wholeCommand);

    return {
	status : this.getStatus()
    };
}

// ----------------------------------------------- ACCOUNT OPERATIONS

function inquireAccount(keyNumber, reference) {
    var keyNumberBS = new ByteString(Utils.numbers.fixedLengthIntString(
	    keyNumber.toString(16), 2), HEX);

    var apduCommand = new ByteString("80 E4", HEX).concat(keyNumberBS).concat(
	    new ByteString('00 04', HEX)).concat(reference);

    this.plainApdu(apduCommand);
    return {
	status : this.getStatus()
    };
}

function getInquireAccountResponse(reference, keyNumber) {
    var resp = this.getResponse(0x19);
    var return_val =  {
	data : resp,
	status : this.getStatus()
    }
    
    var trans_types = ['NONE', 'DEBIT', 'REVOKE DEBIT', 'CREDIT'];
    if(this.getStatus() === '9000'){
	return_val.MAC = resp.left(4);
	return_val.transType = trans_types[resp.bytes(4, 1).toUnsigned()];
	return_val.balance = resp.bytes(5, 3).toUnsigned();
	return_val.atref = resp.bytes(8, 6);
	return_val.maxBalance = resp.bytes(14, 3).toUnsigned();
	return_val.creditEntity = resp.bytes(17, 4);;
	return_val.debitEntity = resp.right(4);
	
	var macChain =  reference.concat(resp.bytes(4, 1));
	macChain = macChain.concat(new ByteString('00 00 00', HEX).add(return_val.balance));
	macChain = macChain.concat(return_val.atref).concat(new ByteString('00 00', HEX));

	var cMac = this.calcMAC(macChain, true, ACCOUNT_KEYS[keyNumber], new ByteString('00 00 00 00 00 00 00 00', HEX))
	//print('cmac: ' + cMac);
	if(return_val.MAC.equals(cMac)){
            print('[SUCCESS] MAC verified!');
	}
	else{
	    print('[ERROR] MAC does not match!!!');
	}
    }
    
    return return_val;
}

function credit(ammount, inquireAccountResp) {
    var reference = inquireAccountResp.creditEntity;
    inquireAccountResp.atref = inquireAccountResp.atref.add(1);
    var ammountBS = new ByteString('00 00 00', HEX).add(ammount);
    
    var macChain =  new ByteString('E2', HEX);
    macChain = macChain.concat(ammountBS);
    macChain = macChain.concat(inquireAccountResp.creditEntity)
    macChain = macChain.concat(inquireAccountResp.atref).concat(new ByteString('00 00', HEX));
    var MAC = this.calcMAC(macChain,true,  ACCOUNT_KEYS[CREDIT_KEY_NUM], new ByteString('00 00 00 00 00 00 00 00', HEX)) 

    var command = new ByteString('80 E2 00 00 0B', HEX).concat(MAC).concat(ammountBS).concat(reference);
    this.plainApdu(command);
    return {
	status : this.getStatus()
    };
}

function debit(amount, TTREF, MAC) {
    var ammountBS = new ByteString(Utils.numbers.fixedLengthIntString(amount
	    .toString(16), 6), HEX);
    var macBS = new ByteString(MAC, ASCII).left(4);
    var ttrefBS = new ByteString(Utils.numbers.fixedLengthIntString(TTREF
	    .toString(16), 6), HEX);

    var command = new ByteString('80 E6 00 0B', HEX).concat(macBS).concat(
	    amountBS).concat(ttrefBS);

    return {
	status : this.getStatus()
    };
}

function revokeDebit(MAC) {
    var macBS = new ByteString(MAC, ASCII).left(4);

    var command = new ByteString('80 E8 00 04', HEX).concat(macBS);

    return {
	status : this.getStatus()
    };
}

// ---------------------------- CONCRETE FILE METHODS

function openMCUIDFile() {
    return this.openFile('FF00');
}

function openManufacturerFile() {
    return this.openFile('FF01');
}

function openPersonalizationFile() {
    var resp = this.openFile('FF02');
    return {
	data : resp,
	status : this.getStatus()
    }
}

function openSecurityFile() {
    var resp = this.openFile('FF03');
    return {
	data : resp,
	status : this.getStatus()
    }
}

function openUserManagFile() {
    var resp = this.openFile('FF04');
    return {
	data : resp,
	status : this.getStatus()
    }
}

function openAccountFile() {
    return this.openFile('FF05');
    return {
	data : resp,
	status : this.getStatus()
    };
}

function openAccountSecurityFile() {
    var resp = this.openFile('FF06');
    return {
	data : resp,
	status : this.getStatus()
    }
}

function openATRFile() {
    var resp = this.openFile('FF07');
    return {
	data : resp,
	status : this.getStatus()
    }
}
