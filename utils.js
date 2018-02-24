Utils = {
		numbers: {},
		bytes: {}
};

Utils.numbers.fixedLengthIntString = function (num, length){
	return ("00000000000000000" + num).slice(-1*length);
}

Utils.bytes.calcChecksum = function (bytes){
    var resultBS = new ByteString('00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00', HEX);
    for(var i=0; i<bytes.length; i++){
	resultBS = resultBS.add(bytes.byteAt(i))
    }
    resultBS = resultBS.add(1)
    return resultBS.right(1);
}



