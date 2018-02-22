Utils = {
		numbers: {}
};

Utils.numbers.fixedLengthIntString = function (num, length){
	return ("00000000000000000" + num).slice(-1*length);
}



