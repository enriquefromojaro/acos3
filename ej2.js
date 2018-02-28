load('utils.js');
load('card_prototype_extension.js');

ej2 = {
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


	var resp = card.openPersonalizationFile();
	if (resp.status !== '9000'){
		print('[ERROR] Error on opening personalization file')
		return null;
	}

	/************** if writen byte to byte it would be like this
	//Writing Option register byte
	card.writeRecord(0, 0, 1, new ByteString('25', HEX));

	// Writing Security option register. I'm not sure if it should be 0x14 or 0x54
	card.writeRecord(0, 1, 1, new ByteString('54', HEX));

	// Writing number_pf_files register
	card.writeRecord(0, 2, 1, new ByteString('04', HEX));
	
	print(card.readRecord(0, 0, 4));

	/**/
	card.writeRecord(0, 0, 3, new ByteString('25 54 04', HEX));
	
    }

};

