load('card_prototype_extension.js')

 /* LEE LOS FICHEROS DE LA ZONA DE MEMORIA INTERNA DE LA ACOS3 */
card = new Card();
atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
card.presentIC()
print("");

//print("SE SELECCIONA EL FICHERO MCU-ID FILE FILE FF00");
resp = card.openMCUIDFile();
print("          MCU-ID FILE FILE FF00");
for (var i=0; i < 2; i++){
	resp = card.readRecord(i, 0, 8);
	print("");
	print("MCU-ID FILE Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}


print("          MANUFACTURER FILE FF01");
resp = card.openManufacturerFile();
print("");
print("MANUFACTURER FILE FF01 TIENE 2 RECORDS DE 8 BYTES.");
for (var i=0; i < 2; i++){
	resp = card.readRecord(i, 0, 8);
	print("");
	print("MANUFACTURER FILE Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}
print("");

//print("          PERSONALIZATION FILE FF02");
resp = card.openPersonalizationFile();
print("PERSONALIZATION FILE FF02 TIENE 3 RECORDS DE 4 BYTES.");
for (var i=0; i < 3; i++){
	resp = card.readRecord(i, 0, 4);
	print("");
	print("PERSONALIZATION FILE Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}
print("");


print("          FICHERO SECURITY FILE FF03 TIENE 14 RECORDS DE 8 BYTES");
resp = card.openSecurityFile();
for (var i=0; i < 10; i++){
	resp = card.readRecord(i, 0, 4);
	print("");
	print("SECURITY FILE Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}
resp = card.readRecord(0x0A, 0, 8);
print("SECURITY FILE Record Nº 0A:" + "  " + resp);

resp = card.readRecord(0x0B, 0, 8);
print("SECURITY FILE Record Nº 0B:" + "  " + resp);

resp = card.readRecord(0x0C, 0, 8);
print("SECURITY FILE Record Nº 0C:" + "  " + resp);

resp = card.readRecord(0x0D, 0, 8);
print("SECURITY FILE Record Nº 0D:" + "  " + resp);
print("");

print("          FICHERO USER FILE MANAGEMENT FF04");
resp = card.openUserManagFile();

print("");
for (var i=0; i < 8; i++){
	resp = card.readRecord(i, 0, 7);
	print("USER FILE MANAGEMENT Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}
print("Código SW:" + card.SW.toString(16));
print("");


print("          FICHERO ACCOUNT FILE FF05 OCHO RECORDS DE CUATRO BYTES");
resp = card.openAccountFile();
print("");

for (var i=0; i < 8; i++){
	resp = card.readRecord(i, 0, 4);
	print("ACCOUNT FILE Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}
print("");

print("          FICHERO ACCOUNT SECURETY FILE FF06 8 RECORDS DE OCHO BYTES");
resp = card.openAccountSeverityFile();
print("");

for (var i=0; i < 8; i++){
	resp = card.readRecord(i, 0, 8);
	print("ACCOUNT FILE Record Nº 0" + i + ":" + "  " + resp + "   " + resp.toString(ASCII));
}
print();


print("          FICHERO ATR FILE FF07 UN RECORDS DE 36 BYTES");
resp = card.openATRFile();
print("");

resp = card.readRecord(0, 0, 0x24);

print("ATR FILE Record Nº 00:" + "  " + resp);

print("");
print("Código SW: " + card.SW.toString(16));
