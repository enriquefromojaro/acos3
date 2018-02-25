load('utils.js');
load('card_prototype_extension.js');

ej7 = {
    main : function() {

	var card = new Card();
	var atr = card.reset(Card.RESET_COLD);

	// No authentication is required to read and write the files

	// Binary file 8DC1
	var fileName = '8DC1';
	var resp = card.openFile(fileName);
	if (resp.status !== '9000' && ! resp.status.substring(0, 2) ==='91') {
	    print('[ERROR] Error on opening file 8DC1: ' + resp.status)
	    return null;
	}

	var str = this.getFileText(fileName, 256);
	print (str)
	resp = card.writeBinary(0, 0, str.length, new ByteString(str, ASCII));
	if (resp.status !== '9000') {
	    print('[ERROR] Error on writing file 8DC1: ' + resp.status)
	    return null;
	}	
	
	print('-----------------------------------------------------------------------')
	
	
	// Binary file 8DC2
	fileName = '8DC2'
	var resp = card.openFile(fileName);
	if (resp.status !== '9000' && ! resp.status.substring(0, 2) ==='91') {
	    print('[ERROR] Error on opening file 8DC1: ' + resp.status)
	    return null;
	}
	
	
	// in apdu write command, length is defined by 1 Byte, so we cannot write more than 255 bytes
	// in a time. In this case, is more than enough
	var str = this.getFileText(fileName, 255);
	print (str)
	resp = card.writeBinary(0, 0, str.length, new ByteString(str, ASCII));
	if (resp.status !== '9000') {
	    print('[ERROR] Error on writing file 8DC2: ' + resp.status)
	    return null;
	}
	
	print('-----------------------------------------------------------------------')
	// record file 8DC3 127 records * 16B
	fileName = '8DC3'
	var resp = card.openFile(fileName);
	if (resp.status !== '9000' && ! resp.status.substring(0, 2) ==='91') {
	    print('[ERROR] Error on opening file 8DC3: ' + resp.status)
	    return null;
	}
		
	var str = this.getFileText(fileName, 16);
	print (str)
	resp = card.writeRecord(0, 0, str.length, new ByteString(str, ASCII));
	if (resp.status !== '9000') {
	    print('[ERROR] Error on writing file 8DC3: ' + resp.status)
	    return null;
	}
	
	
	print('-----------------------------------------------------------------------')
	// record file 8DC4 255 records * 64B
	fileName = '8DC4'
	var resp = card.openFile(fileName);
	if (resp.status !== '9000' && ! resp.status.substring(0, 2) ==='91') {
	    print('[ERROR] Error on opening file 8DC3: ' + resp.status)
	    return null;
	}
		
	var str = this.getFileText(fileName, 64);
	print (str)
	resp = card.writeRecord(0, 0, str.length, new ByteString(str, ASCII));
	if (resp.status !== '9000') {
	    print('[ERROR] Error on writing file 8DC4: ' + resp.status)
	    return null;
	}
	
    },

    getFileText : function(fileName, recordLength) {
	var alumnName = 'Enrique';
	var quijote = 'En un lugar de la mancha de cuyo nombre no quiero acordarme';
	var subject = 'Aplicaciones para Smart Cards';
	var acadCourse = '2017 2018'

	var result = [ fileName, alumnName, 'MASTER DE SISTEMAS', subject,
		acadCourse, fileName, quijote ];

	return result.join(' ').substring(0, recordLength);

    }

};
