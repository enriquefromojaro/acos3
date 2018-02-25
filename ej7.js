load('utils.js');
load('card_prototype_extension.js');

ej7 = {
    main: function () {

	var card = new Card();
	var atr = card.reset(Card.RESET_COLD);
	
	// No authentication is required to read and write the files
	
	// Opening binary file 8DC1
	var resp = card.openFile('8DC1');
	if (resp.status !== '9000'){
		print('[ERROR] Error on opening file 8DC1: ' + resp.status)
		return null;
	}
	print('BEFORE: ' + card.reaBinary(0, 0, 256).data);
	
	var str = this.getFileText(fileName, recordLength);
	resp = card.writeBinary(0, 0, str.length, new ByteString(str, ASCII));
	print('AFTER: ' + card.reaBinary(0, 0, 256).data);
	
	
/*	// Writing debit key
	resp = card.writeRecord(0, 0, 8, new ByteString('80 81 82 83 84 85 86 87', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing debit key')
		return null;
	}
	
	// Writing credit key
	resp = card.writeRecord(1, 0, 8, new ByteString('90 91 92 93 94 95 96 97', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing credit key')
		return null;
	}
	
	// Writing certify key
	resp = card.writeRecord(2, 0, 8, new ByteString('A0 A1 A2 A3 A4 A5 A6 A7', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on certify key')
		return null;
	}
	
	// Writing revoke debit key
	resp = card.writeRecord(3, 0, 8, new ByteString('B0 B1 B2 B3 B4 B5 B6 B7', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on revoke debit key')
		return null;
	}*/
	
    },
    
    getFileText: function (fileName, recordLength){
	var alumnName = 'Enrique';
	var quijote = 'En un lugar de la mancha de cuyo nombre no quiero acordarme';
	var subject = 'Aplicaciones para Smart Cards';
	var acadCourse = '2017 2018'
	
	var result = [
	    fileName,
	    alumnName,
	    'MASTER DE SISTEMAS',
	    subject,
	    acadCourse,
	    fileName,
	    quijote
	];
	
	return result.join(' ').sustring(recordLength);

    }

};

ej7.main();