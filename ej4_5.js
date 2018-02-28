load('utils.js');
load('card_prototype_extension.js');

card = new Card()

card.openFile('8DC1');
print(card.readBinary(0, 0, 255).data)
card.openFile('8DC2');
print(card.readBinary(0, 0, 255).data)
print(card.readBinary(0, 0, 255).data)
print(card.readBinary(0, 0, 255).data)
print(card.readBinary(0, 0, 255).data)
card.openFile('8DC3')
for (var i=0; i<127; i++){
    print(card.readRecord(i, 0, 16).data)
}
card.openFile('8DC4')
for (var i=0; i<255; i++){
    print(card.readRecord(i, 0, 64).data)
}