Card.prototype.readFile = readFile;
Card.prototype.presentIC = presentIC;


function presentIC(){
	print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
	resp = this.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
	print("Código SW: " + card.SW.toString(16));
}

function readFile (file){
	var apduCommand = new ByteString("80 A4 00 00 02", HEX);
	var wholeCommand = apduCommand.concat(new ByteString(file, HEX));
	return this.plainApdu(wholeCommand);
}

