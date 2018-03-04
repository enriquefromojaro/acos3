load('utils.js');
load('card_prototype_extension.js');

ej17 = {
    main : function() {

	var card = new Card();
	var atr = card.reset(Card.RESET_COLD);
	
	var authenticated = card.authenticate();
	if (! authenticated){
	    print('[ERROR] Not authenticated!!! Access denied!!');
	    return null;
	}else{
	    print('Autehnticated!!! access garanteed!!');
	}
	/*var PIN = new ByteString('42 42 42 42 42 42 42 42', HEX)
	var resp = card.submitPIN(PIN);
	if (resp.status !== '9000'){
	    print('[ERROR] Invalid PIN!! status: ' + resp.status);
	    return null;
	}else{
	    print('Valid PIN!! Access granted!!');
	}*/

	//print('AUTHENTICATED: ' + card.authenticate());
	var resp = card.inquireAccount(2, new ByteString('00 00 00 00', HEX), true);
	if(resp.status !== '9000' && resp.status !== '6882'){
	    print('[ERROR] Error on inquire account: ' + resp.status);
	}
	
	resp = card.getInquireAccountResponse(new ByteString('00 00 00 00', HEX), 2, true);
	print(resp.status);
	if (resp.status === '9000'){
	    print('MAC:           ' + resp.MAC);
	    print('Trans. Type:   ' + resp.transType);
	    print('Balance:       ' + resp.balance);
	    print('ATREF:         ' + resp.atref);
	    print('Max. Balance:  ' + resp.maxBalance);
	    print('Credit Entity: ' + resp.creditEntity);
	    print('Debit Entity:  ' + resp.debitEntity);
	}
	else
	    return null
	
    }

};

//ej17.main();
//readcard();
