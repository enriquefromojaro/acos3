load('utils.js');

Card.prototype.getStatus = getStatus

Card.prototype.getResponse = getResponse;
Card.prototype.getAuthenticateResponse = getAuthenticateResponse;
Card.prototype.getInquireAccountResponse = getInquireAccountResponse;


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
Card.prototype.openAccountSeverityFile = openAccountSeverityFile;
Card.prototype.openATRFile = openATRFile;


// ----------------------------   SEVERAL PURPOSE METHODS

function presentIC(){
	print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
	resp = this.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
	return {
	    data: resp,
	    status: this.getStatus()
	};
}

function openFile(file){
	var apduCommand = new ByteString("80 A4 00 00 02", HEX);
	var wholeCommand = apduCommand.concat(new ByteString(file, HEX));
	this.plainApdu(wholeCommand);

	return {
		status: this.getStatus()
	}
}

function readRecord(record, offset, length){
	var resp = this.sendApdu(0x80, 0xB2, record, offset, length);
	return {
		data: resp,
		status: this.getStatus()
	}
}

function getStatus(){
	return this.SW.toString(16);
}

function startSession(){
	var resp = this.sendApdu(0x80, 0x84, 0x00, 0x00, 0x08);
	return {
		cardRandom: resp,
		status: this.getStatus()
	}
}

function getAuthenticateResponse(){
	var resp = this.getResponse(0x08);
	return {
		data: resp,
		status: this.getStatus()
	}
}

function getResponse(respCode){
	return this.sendApdu(0x80, 0xC0, 0x00, 0x00, respCode);
}

function clearCard(){
	this.sendApdu(0x80, 0x30, 0x00, 0x00, 0x00);
	return {
		status: this.getStatus()
	}
}

function writeRecord(record, offset, len, bytes){
	var apduCommand = new ByteString("80 D2", HEX);
	var recordBS = new ByteString( Utils.numbers.fixedLengthIntString(record.toString(16), 2), HEX);
	var offSetBS = new ByteString( Utils.numbers.fixedLengthIntString(offset.toString(16), 2), HEX);
	var lenBS = new ByteString( Utils.numbers.fixedLengthIntString(len.toString(16), 2), HEX);


	var wholeCommand = apduCommand.concat(recordBS);
	var wholeCommand = wholeCommand.concat(offSetBS);
	var wholeCommand = wholeCommand.concat(lenBS);
	var wholeCommand = wholeCommand.concat(bytes);
	this.plainApdu(wholeCommand);
	
	return {status: this.getStatus()}
}

function readBinary(highOffset, lowOffset, len){
	var resp = this.sendApdu(0x80, 0xB0, highOffset, lowOffset, len);
	return {
		data: resp,
		status : this.getStatus()
	}
}

function writeBinary(highOffset, lowOffset, len, bytes){
	var apduCommand = new ByteString("80 A4 00 00 02", HEX);
	var h_offsetBS = new ByteString( Utils.numbers.fixedLengthIntString(highOffset.toString(16), 2), HEX);
	var l_offsetBS = new ByteString( Utils.numbers.fixedLengthIntString(lowOffset.toString(16), 2), HEX);
	var lenBS = new ByteString( Utils.numbers.fixedLengthIntString(len.toString(16), 2), HEX);

	var wholeCommand = apduCommand.concat(h_offsetBS);
	var wholeCommand = wholeCommand.concat(l_offsetBS);
	var wholeCommand = wholeCommand.concat(lenBS);
	var wholeCommand = wholeCommand.concat(bytes);
	this.plainApdu(wholeCommand);

	return {status: this.getStatus()};
}


// ----------------------------------------------- ACCOUNT OPERATIONS

function inquireAccount(keyNumber, reference){
	var keyNumberBS = new ByteString( Utils.numbers.fixedLengthIntString(keyNumber.toString(16), 2), HEX);

	var apduCommand = new ByteString("80 E4", HEX).concat(keyNumberBS).concat(new ByteSting('00 04', HEX)).concat(reference);

	this.plainApdu(apduCommand);
	return {status: this.getStatus()};
}

function getInquireAccountResponse(){
	var resp = this.getResponse(0x19);
	return {
		data: resp,
		status: this.getStatus()
	}
}

function credit(amount, TTREF, MAC){
	var ammountBS = new ByteString( Utils.numbers.fixedLengthIntString(amount.toString(16), 6), HEX);
	var macBS = new ByteString(MAC, ASCII).left(4);
	var ttrefBS = new ByteString( Utils.numbers.fixedLengthIntString(TTREF.toString(16), 6), HEX);

	var command = new ByteString('80 E2 00 0B', HEX).concat(macBS).concat(amountBS).concat(ttrefBS);

	return {status: this.getStatus()};
}

function debit(amount, TTREF, MAC){
	var ammountBS = new ByteString( Utils.numbers.fixedLengthIntString(amount.toString(16), 6), HEX);
	var macBS = new ByteString(MAC, ASCII).left(4);
	var ttrefBS = new ByteString( Utils.numbers.fixedLengthIntString(TTREF.toString(16), 6), HEX);

	var command = new ByteString('80 E6 00 0B', HEX).concat(macBS).concat(amountBS).concat(ttrefBS);

	return {status: this.getStatus()};
}

function revokeDebit(MAC){
	var macBS = new ByteString(MAC, ASCII).left(4);

	var command = new ByteString('80 E8 00 04', HEX).concat(macBS);

	return {status: this.getStatus()};
}

// ----------------------------  CONCRETE FILE METHODS

function openMCUIDFile(){
	return this.openFile('FF00');
}

function openManufacturerFile(){
	return this.openFile('FF01');
}

function openPersonalizationFile(){
	var resp = this.openFile('FF02');
	return {
		data: resp,
		status: this.getStatus()
	}
}

function openSecurityFile(){
	var resp = this.openFile('FF03');
	return {
		data: resp,
		status: this.getStatus()
	}
}

function openUserManagFile(){
	var resp = this.openFile('FF04');
	return {
		data: resp,
		status: this.getStatus()
	}
}

function openAccountFile(){
	return this.openFile('FF05');
	return {
		data: resp,
		status: this.getStatus()
	}
}

function openAccountSeverityFile(){
	var resp = this.openFile('FF06');
	return {
		data: resp,
		status: this.getStatus()
	}
}

function openATRFile(){
	var resp = this.openFile('FF07');
	return {
		data: resp,
		status: this.getStatus()
	}
}
