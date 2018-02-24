load('utils.js');
load('card_prototype_extension.js');

var card = new Card();
var atr = card.reset(card.COLD_RESET);

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

/************** NO DESCOMENTAR HASTA ESTAR SEGUROSE QUE ESTÁ BIEN
//Writing Ooption register byte
card.writeRecord(0, 0, 1, new ByteString('25', HEX));

// Writing Security option register. I'm not sure if it should be 0x14 or 0x54
card.writeRecord(1, 0, 1, new ByteString('54', HEX));

// Writing number_pf_files register
card.writeRecord(1, 0, 1, new ByteString('04', HEX));

*/

