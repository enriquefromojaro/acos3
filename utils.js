Utils = {
    numbers : {},
    bytes : {}
};

Utils.numbers.fixedLengthIntString = function(num, length) {
    return ("00000000000000000" + num).slice(-1 * length);
}

Utils.bytes.calcChecksum = function(bytes) {
    var resultBS = new ByteString(
	    '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00', HEX);
    for (var i = 0; i < bytes.length; i++) {
	resultBS = resultBS.add(bytes.byteAt(i))
    }
    resultBS = resultBS.add(1)
    return resultBS.right(1);
}

Utils.bytes.encryptECB = function (plain, cypherKey) {
    var crypto = new Crypto();
    var key = new Key();
    key.setComponent(Key.DES, cypherKey);

    var cyphered = crypto.encrypt(key, Crypto.DES_ECB, plain);

    return cyphered;
}


Utils.bytes.decryptECB = function (crypted, cypherKey) {

    var crypto = new Crypto();
    var key = new Key();
    key.setComponent(Key.DES, cypherKey);

    var decrypted = crypto.decrypt(key, Crypto.DES_ECB, crypted);
    return decrypted;
}

Utils.bytes.encryptCBC = function (plain, cypherKey, iv) {
    var crypto = new Crypto();
    var key = new Key();
    key.setComponent(Key.DES, cypherKey);
    var plaincpy = plain.pad(Crypto.ISO9797_METHOD_2);

    var cyphered = crypto.encrypt(key, Crypto.DES_CBC, plaincpy, iv);

    return cyphered;
}


Utils.bytes.decryptCBC = function (crypted, cypherKey, iv) {

    var crypto = new Crypto();
    var key = new Key();
    key.setComponent(Key.DES, cypherKey);

    var decrypted = crypto.decrypt(key, Crypto.DES_CBC, crypted, iv);
    return decrypted;
}
