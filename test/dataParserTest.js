const assert = require('assert');
const parser = require('../dataParser');

describe('DataParser', function() {
    it('getNibble returns the nth nibble', function () {
        assert.strictEqual(parser.getNibble(0xABCD, 0), 0x000D);
        assert.strictEqual(parser.getNibble(0xABCD, 1), 0x000C);
        assert.strictEqual(parser.getNibble(0xABCD, 2), 0x000B);
        assert.strictEqual(parser.getNibble(0xABCD, 3), 0x000A);
    });
    it('getByte returns the nth byte', function () {
        assert.strictEqual(parser.getByte(0xABCD, 0), 0x00CD);
        assert.strictEqual(parser.getByte(0xABCD, 1), 0x00AB);
    });
});
