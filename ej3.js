load('utils.js');
load('card_prototype_extension.js');

ej3 = {
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

	// Opening the personalization file


	var resp = card.openSecurityFile();
	if (resp.status !== '9000'){
		print('[ERROR] Error on opening security file')
		return null;
	}
	
	
	// writing PIN
	resp = card.writeRecord(1, 0, 8, new ByteString('30 31 32 33 34 35 36 37', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing PIN')
		return null;
	}
	
	
	// writing card DES key
	resp = card.writeRecord(2, 0, 8, new ByteString('DD 00 DD 01 DD 02 DD 03', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing card DES key')
		return null;
	}
	
	//Writing terminal DES key
	resp = card.writeRecord(3, 0, 8, new ByteString('AA 00 AA 01 AA 02 AA 03', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing terminal DES key')
		return null;
	}
	
	//Writing random seed
	resp = card.writeRecord(4, 0, 8, new ByteString('DC FD CF DC FD CF DC FD', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing random seed')
		return null;
	}
	
	//Writing AC1
	resp = card.writeRecord(5, 0, 8, new ByteString('11 AC 11 AC 11 AC 11 AC', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing AC1')
		return null;
	}
	
	//Writing AC2
	resp = card.writeRecord(6, 0, 8, new ByteString('22 AC 22 AC 22 AC 22 AC', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing AC2')
		return null;
	}
	
	//Writing AC3
	resp = card.writeRecord(7, 0, 8, new ByteString('33 AC 33 AC 33 AC 33 AC', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing AC3')
		return null;
	}
	
	//Writing AC4
	resp = card.writeRecord(8, 0, 8, new ByteString('44 AC 44 AC 44 AC 44 AC', HEX));
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing AC4')
		return null;
	}
	
	//Writing AC5
	resp = card.writeRecord(9, 0, 8, new ByteString('55 AC 55 AC 55 AC 55 AC', HEX));	
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing AC5')
		return null;
	}
	
    }

};

