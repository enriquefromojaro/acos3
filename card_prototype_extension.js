load('utils.js');

Card.prototype.openFile = openFile;
Card.prototype.presentIC = presentIC;
Card.prototype.startSession = startSession;
Card.prototype.getResponse = getResponse;
Card.prototype.clearCard = clearCard;
Card.prototype.writeRecord = writeRecord;


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
	print("Código SW: " + card.SW.toString(16));
}

function openFile(file){
	var apduCommand = new ByteString("80 A4 00 00 02", HEX);
	var wholeCommand = apduCommand.concat(new ByteString(file, HEX));
	return this.plainApdu(wholeCommand);
}

function readRecord(record, offset, length){
	return this.sendApdu(0x80, 0xB2, record, offset, length);
}

function startSession(){
	return this.sendApdu(0x80, 0x84, 0x00, 0x00, 0x08);
}

function getResponse(){
	return this.sendApdu(0x80, 0xC0, 0x00, 0x00, 0x08);
}

function clearCard(){
	return this.sendApdu(0x80, 0x30, 0x00, 0x00, 0x00);
}

function writeRecord(record, offset, len, bytes){
	var apduCommand = new ByteString("80 A4 00 00 02", HEX);
	var recordBS = new ByteString( Utils.numbers.fixedLengthIntString(record.toString(16), 2), HEX);
	var offSetBS = new ByteString( Utils.numbers.fixedLengthIntString(offset.toString(16), 2), HEX);
	var lenBS = new ByteString( Utils.numbers.fixedLengthIntString(len.toString(16), 2), HEX);


	var wholeCommand = apduCommand.concat(recordBS);
	var wholeCommand = wholeCommand.concat(offSetBS);
	var wholeCommand = wholeCommand.concat(lenBS);
	var wholeCommand = wholeCommand.concat(bytes);
	return this.plainApdu(wholeCommand);
}

// ----------------------------  CONCRETE FILE METHODS

function openMCUIDFile(){
	return this.openFile('FF00');
}

function openManufacturerFile(){
	return this.openFile('FF01');
}

function openPersonalizationFile(){
	return this.openFile('FF02');
}

function openSecurityFile(){
	return this.openFile('FF03');
}

function openUserManagFile(){
	return this.openFile('FF04');
}

function openAccountFile(){
	return this.openFile('FF05');
}

function openAccountSeverityFile(){
	return this.openFile('FF06');
}

function openATRFile(){
	return this.openFile('FF07');
}