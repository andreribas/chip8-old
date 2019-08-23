exports.getNibble = function(word, nibblePos) {
    switch (nibblePos) {
        case 0: return (word      ) & 0x000F;
        case 1: return (word >>  4) & 0x000F;
        case 2: return (word >>  8) & 0x000F;
        case 3: return (word >> 12) & 0x000F;
        default: throw "Error trying to access nibble at position " + nibblePos.toString() + " from the word " + word.toString()
    }
};

exports.getByte = function(word, bytePos) {
    switch (bytePos) {
        case 0: return (word     ) & 0x00FF;
        case 1: return (word >> 8) & 0x00FF;
        default: throw "Error trying to access byte at position " + bytePos.toString() + " from the word " + word.toString()
    }
};
