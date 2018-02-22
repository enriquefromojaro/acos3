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
resp = card.readRecord(0, 0, 8);
print("");
print("MCU-ID FILE Record Nº 0:" + "  " + resp + "   " + resp.toString(ASCII));
resp = card.readRecord(1, 0, 8);
print("MCU-ID FILE Record Nº 1:" + "  " + resp + "   " + resp.toString(ASCII));
print("");

print("          MANUFACTURER FILE FF01");
resp = card.openManufacturerFile();
print("");
print("MANUFACTURER FILE FF01 TIENE 2 RECORDS DE 8 BYTES.");
resp = card.readRecord(0, 0, 8);
print("");
print("MANUFACTURER FILE Record Nº 00:" + "  " + resp);
resp = card.readRecord(1, 0, 8);
print("MANUFACTURER FILE Record Nº 01:" + "  " + resp);
print("");

//print("          PERSONALIZATION FILE FF02");
resp = card.openPersonalizationFile();
print("PERSONALIZATION FILE FF02 TIENE 3 RECORDS DE 4 BYTES.");
resp = card.readRecord(0, 0, 4);
print("");
print("PERSONALIZATION FILE Record Nº 00:" + "  " + resp);
resp = card.readRecord(1, 0, 4);
print("PERSONALIZATION FILE Record Nº 01:" + "  " + resp);
resp = card.readRecord(2, 0, 4);
print("PERSONALIZATION FILE Record Nº 02:" + "  " + resp);
print("");


print("          FICHERO SECURITY FILE FF03 TIENE 14 RECORDS DE 8 BYTES");
resp = card.openSecurityFile();
print("");

resp = card.readRecord(0, 0, 8);
print("SECURITY FILE Record Nº 00:" + "  " + resp + "   " + resp.toString(ASCII));

resp = card.readRecord(1, 0, 8);
print("SECURITY FILE Record Nº 01:" + "  " + resp + "   " + resp.toString(ASCII));

resp = card.readRecord(2, 0, 8);
print("SECURITY FILE Record Nº 02:" + "  " + resp);

resp = card.readRecord(3, 0, 8);
print("SECURITY FILE Record Nº 03:" + "  " + resp);

resp = card.readRecord(4, 0, 8);
print("SECURITY FILE Record Nº 04:" + "  " + resp);

resp = card.readRecord(5, 0, 8);
print("SECURITY FILE Record Nº 05:" + "  " + resp);

resp = card.readRecord(6, 0, 8);
print("SECURITY FILE Record Nº 06:" + "  " + resp);

resp = card.readRecord(7, 0, 8);
print("SECURITY FILE Record Nº 07:" + "  " + resp);

resp = card.readRecord(8, 0, 8);
print("SECURITY FILE Record Nº 08:" + "  " + resp);

resp = card.readRecord(9, 0, 8);
print("SECURITY FILE Record Nº 09:" + "  " + resp);

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

resp = card.readRecord(0, 0, 7);
print("USER FILE MANAGEMENT Record Nº 00:" + "  " + resp);
resp = card.readRecord(1, 0, 8);
print("USER FILE MANAGEMENT Record Nº 01:" + "  " + resp);
resp = card.readRecord(2, 0, 8);
print("USER FILE MANAGEMENT Record Nº 02:" + "  " + resp);
resp = card.readRecord(3, 0, 8);
print("USER FILE MANAGEMENT Record Nº 03:" + "  " + resp);
resp = card.readRecord(4, 0, 8);
print("USER FILE MANAGEMENT Record Nº 04:" + "  " + resp);
resp = card.readRecord(5, 0, 8);
print("USER FILE MANAGEMENT Record Nº 05:" + "  " + resp);
resp = card.readRecord(6, 0, 8);
print("USER FILE MANAGEMENT Record Nº 06:" + "  " + resp);
resp = card.readRecord(7, 0, 8);
print("USER FILE MANAGEMENT Record Nº 07:" + "  " + resp);

print("Código SW:" + card.SW.toString(16));
print("");


print("          FICHERO ACCOUNT FILE FF05 OCHO RECORDS DE CUATRO BYTES");
resp = card.openAccountFile();
print("");

resp = card.readRecord(0, 0, 4);
print("ACCOUNT FILE Record Nº 00:" + "  " + resp);

resp = card.readRecord(1, 0, 4);
print("ACCOUNT FILE Record Nº 01:" + "  " + resp);

resp = card.readRecord(2, 0, 4);
print("ACCOUNT FILE Record Nº 02:" + "  " + resp);

resp = card.readRecord(3, 0, 4);
print("ACCOUNT FILE Record Nº 03:" + "  " + resp);

resp = card.readRecord(4, 0, 4);
print("ACCOUNT FILE Record Nº 04:" + "  " + resp);

resp = card.readRecord(5, 0, 4);
print("ACCOUNT FILE Record Nº 05:" + "  " + resp);

resp = card.readRecord(6, 0, 4);
print("ACCOUNT FILE Record Nº 06:" + "  " + resp);

resp = card.readRecord(7, 0, 4);
print("ACCOUNT FILE Record Nº 07:" + "  " + resp);
print("");

print("          FICHERO ACCOUNT SECURETY FILE FF06 8 RECORDS DE OCHO BYTES");
resp = card.openAccountSeverityFile();
print("");

resp = card.readRecord(0, 0, 8);
print("ACCOUNT FILE Record Nº 00:" + "  " + resp);

resp = card.readRecord(1, 0, 8);
print("ACCOUNT FILE Record Nº 01:" + "  " + resp);

resp = card.readRecord(2, 0, 8);
print("ACCOUNT FILE Record Nº 02:" + "  " + resp);

resp = card.readRecord(3, 0, 8);
print("ACCOUNT FILE Record Nº 03:" + "  " + resp);

resp = card.readRecord(4, 0, 8);
print("ACCOUNT FILE Record Nº 04:" + "  " + resp);

resp = card.readRecord(5, 0, 8);
print("ACCOUNT FILE Record Nº 05:" + "  " + resp);

resp = card.readRecord(6, 0, 8);
print("ACCOUNT FILE Record Nº 06:" + "  " + resp);

resp = card.readRecord(7, 0, 8);
print("ACCOUNT FILE Record Nº 07:" + "  " + resp);

print();
print("          FICHERO ATR FILE FF07 UN RECORDS DE 36 BYTES");
resp = card.openATRFile();
print("");

resp = card.readRecord(0, 0, 0x24);

print("ATR FILE Record Nº 00:" + "  " + resp);

print("");
print("Código SW: " + card.SW.toString(16));
