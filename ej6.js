load('utils.js');
load('card_prototype_extension.js');

ej6 = {
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


	// Opening the account security file
	var resp = card.openAccountSecurityFile();
	if (resp.status !== '9000'){
		print('[ERROR] Error on opening account security file')
		return null;
	}
	
	// Writing debit key
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
	}
	
    }

};