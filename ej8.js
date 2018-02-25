load('utils.js');
load('card_prototype_extension.js');

ej8 = {
    main : function() {

	var card = new Card();
	var atr = card.reset(Card.RESET_COLD);

	// No authentication is required to read and write the files
	print ('AUTHENTICATED: ' +  card.authenticate());
	
    }

};
