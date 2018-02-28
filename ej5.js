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
	
	var maxBal = 10000;
	var maxBalAnZeroBS = new ByteString('00 00 00', HEX).add(maxBal).concat(new ByteString('00', HEX));
	print(maxBalAnZeroBS);
	
	// Writing max balance and 00 in record 5
	resp = card.writeRecord(4, 0, 4, maxBalAnZeroBS);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing max balance and 00 in record 4')
		return null;
	}
	
	//Writing AID
	var AID = new ByteString('CC CC 00 01', HEX)
	resp = card.writeRecord(5, 0, 4, AID);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing max balance and 00 in record 4')
		return null;
	}
	
	
	var creditTerminal = new ByteString('AA DD CC 01', HEX);
	
	// Writing credit terminal on record 6
	resp = card.writeRecord(6, 0, 4, creditTerminal);
	if (resp.status !== '9000'){
		print('[ERROR] Error on writing credit terminal on record 6')
		return null;
	}
	
	var debitTerminal = new ByteString('EE CC 00 01', HEX);
	
	// Writing credit terminal on record 7
	resp = card.writeRecord(7, 0, 4, debitTerminal);
	if (resp.status !== '9000'){
		print('[ERROR] Error on debit credit terminal on record 7')
		return null;
	}
	card.close();
	
    }

};
//ej5.main();
