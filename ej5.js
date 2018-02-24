load('utils.js');
load('card_prototype_extension.js');

ej5 = {
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
	var resp = card.openAccountFile();
	if (resp.status !== '9000'){
		print('[ERROR] Error on opening account file')
		return null;
	}
	
	
	print('BEFORE: ')
	for(var i=0; i<8; i++){
	    print('RECORD: ' + i)
	    print(card.readRecord(i, 0, 7).data)
	}
	
	var initialMoney = 5500;  // cents
	var transtyp = '00';
	
	var transtypAndMoneyBS = transtyp + Utils.numbers.fixedLengthIntString(initialMoney.toString(16), 6);
	transtypAndMoneyBS = new ByteString(transtypAndMoneyBS, HEX);
	
	// Writing transtyp and money in records 0 and 2
	resp = card.writeRecord(0, 0, 4, transtypAndMoneyBS);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing transtyp and balance in record 0')
		return null;
	}
	
	// Binary file named 8DC2, 1024B, No permissions required
	resp = card.writeRecord(2, 0, 4, transtypAndMoneyBS);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing transtyp and balance in record 2')
		return null;
	}
	
	var atcBS = new ByteString('00 00', HEX);
	
	var checkSum = Utils.bytes.calcChecksum(transtypAndMoneyBS.concat(atcBS));
	
	// Writing atc, checksum and 0 in records 1 and 3
	var recordValue = atcBS.concat(checkSum).concat(new ByteString('00', HEX))
	resp = card.writeRecord(1, 0, 4, recordValue);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing atc, checksum and 0 in record 1')
		return null;
	}
	
	// Writing atc, checksum and 0 in records 1 and 3
	resp = card.writeRecord(3, 0, 4, recordValue);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing atc, checksum and 0 in record 3')
		return null;
	}
//	
//	// Record file named 8DC3, 127 records * 16B, No permissions required
//	resp = card.writeRecord(2, 0, 7, new ByteString('0F 7F 00 00 8D C3 00', HEX));
//	if (resp.status !== '9000'){
//		print('[ERROR] Error on writing cofig of record file ODC3')
//		return null;
//	}
//	
//	// Record file named 8DC4, 255 records * 64B, No permissions required
//	resp = card.writeRecord(3, 0, 7, new ByteString('40 FF 00 00 8D C4 00', HEX));
//	if (resp.status !== '9000'){
//		print('[ERROR] Error on writing cofig of record file ODC4')
//		return null;
//	}
	
	print('AFTER: ')
	for(var i=0; i<8; i++){
	    print('RECORD: ' + i)
	    print(card.readRecord(i, 0, 7).data)
	}
	
	
    }

};

ej5.main()
