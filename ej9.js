load('utils.js');
load('card_prototype_extension.js');

ej9 = {
    main : function() {

	var card = new Card();
	var atr = card.reset(Card.RESET_COLD);

	print('AUTHENTICATED: ' + card.authenticate());
	card.openFile('8DC4')
	var str = new ByteString('MASTER SSDDEE.2017. Enrique Fernandez Romojaro Tarjetas', ASCII);
	var resp = card.writeRecord(8, 0, str.length, str, true);
	if(resp.status !== '9000' && resp.status !== '6882'){
	    print ('[ERRROR] Error on sending SM write file');
	    return null;
	}
	
	resp = card.getSMResponse();
	if(resp.commandStatus !== '9000'){
	    print ('[ERRROR] Error on WRITING file: ' + resp.commandStatus);
	    return null;
	}

    }

};
