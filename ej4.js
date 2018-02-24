load('utils.js');
load('card_prototype_extension.js');

ej4 = {
    main: function () {

	var card = new Card();
	var atr = card.reset(Card.RESET_COLD);


	// We present the IC in order to get root access

	var icResult = card.presentIC()
	
	if (icResult.status !== '9000'){
	    print('[ERROR] Error on presenting IC. Closing connection');
	    card.close();
	    return null;
	}

	// Opening the user's files management file
	var resp = card.openUserManagFile();
	if (resp.status !== '9000'){
		print('[ERROR] Error on opening user\'s files management file')
		return null;
	}
	
	// Binary file named 8DC1, 256B, No permissions required
	resp = card.writeRecord(0, 0, 7, new ByteString('01 00 00 00 8D C1 80', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing cofig of binary file ODC1')
		return null;
	}
	
	// Binary file named 8DC2, 1024B, No permissions required
	resp = card.writeRecord(1, 0, 7, new ByteString('04 00 00 00 8D C2 80', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing cofig of binary file ODC2')
		return null;
	}
	
	// Record file named 8DC3, 127 records * 16B, No permissions required
	resp = card.writeRecord(2, 0, 7, new ByteString('0F 7F 00 00 8D C3 00', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing cofig of record file ODC3')
		return null;
	}
	
	// Record file named 8DC4, 255 records * 64B, No permissions required
	resp = card.writeRecord(3, 0, 7, new ByteString('40 FF 00 00 8D C4 00', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing cofig of record file ODC4')
		return null;
	}
	
	
    }

};
