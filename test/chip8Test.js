let assert = require('assert');
let chip8 = require('../chip8');

describe('Opcodes', function() {
    it('Opcode 6XNN should set value NN to register X', function () {
        let cpu = chip8.buildInitialCpuState();
        for (const opcode of opcodesBetween(0x6000, 0x6FFF)) {
            let register = opcode.substr(1, 1);
            let value = opcode.substr(2, 2);

            chip8.executeOpcode(opcode, cpu);

            assert.equal(cpu.V[register], parseInt(value, 16));
        }
    });
});

function* opcodesBetween(init, end) {
    for (let opcodeCount = init; opcodeCount <= end; opcodeCount++) {
        yield opcodeCount.toString(16);
    }
}