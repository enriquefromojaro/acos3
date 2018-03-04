load('utils.js');
load('card_prototype_extension.js');

ej15 = {
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
	var PIN = new ByteString('30 31 32 33 34 35 36 37', HEX)
	var resp = card.submitPIN(PIN);
	if (resp.status !== '9000'){
	    print('[ERROR] Invalid PIN!! status: ' + resp.status);
	    return null;
	}else{
	    print('Valid PIN!! Access granted!!');
	}
	
	var resp = card.changePIN(new ByteString('42 42 42 42 42 42 42 42', HEX));
	if(resp.status !== '9000'){
	    print('[ERROR] Error on changing PIN: ' + resp.status);
	    return null;
	}
	else
	    print('PIN successfuly changed!!');
    }

};

ej15.main();
//readcard();
