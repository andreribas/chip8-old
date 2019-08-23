const assert = require('assert');
const chip8 = require('../chip8');
const parser = require('../dataParser');

describe('Opcodes', function() {
    it('Opcode 0nnn should do nothing :)', function () {
        let cpu = chip8.buildInitialCpuState();
        for (const opcode of opcodesBetween(0x0000, 0x0FFF)) {
            if (opcode === 0x00EE || opcode === 0x00E0) continue;

            chip8.executeOpcode(opcode, cpu);

            assert.deepStrictEqual(cpu, chip8.buildInitialCpuState());
        }
    });
    it('Opcode 00EE should return from a subroutine', function () {
        let cpu = chip8.buildInitialCpuState();
        cpu.SP = 0x0001;
        cpu.stack[0] = 0x0300;

        chip8.executeOpcode(0x00EE, cpu);

        assert.strictEqual(cpu.PC, 0x0300);
        assert.strictEqual(cpu.SP, 0x0000);
    });
    it('Opcode 1nnn should jump to location nnn', function () {
        let cpu = chip8.buildInitialCpuState();
        for (const opcode of opcodesBetween(0x1000, 0x1FFF)) {
            chip8.executeOpcode(opcode, cpu);

            let nnn = opcode & 0x0FFF;
            assert.strictEqual(cpu.PC, nnn);
        }
    });
    it('Opcode 2nnn should call subroutine at nnn', function () {
        for (const opcode of opcodesBetween(0x2000, 0x2FFF)) {
            let cpu = chip8.buildInitialCpuState();
            let nnn = opcode & 0x0FFF;
            let expectedStackPC = cpu.PC + 2;

            chip8.executeOpcode(opcode, cpu);

            assert.strictEqual(cpu.SP, 0x0001);
            assert.strictEqual(cpu.stack[0x0000], expectedStackPC);
            assert.strictEqual(cpu.PC, nnn);
        }
    });
    it('Opcode 3XKK should skip next instruction if Vx is equal to KK', function () {
        let cpu = chip8.buildInitialCpuState();
        let expectedPC = 200;
        cpu.PC = expectedPC;
        for (const opcode of opcodesBetween(0x3000, 0x3FFF)) {
            chip8.executeOpcode(opcode, cpu);

            const Vx = cpu.V[parser.getNibble(opcode, 2)];
            const KK = cpu.V[parser.getByte(opcode, 0)];
            if (Vx === KK) expectedPC += 2;
            assert.strictEqual(cpu.PC, expectedPC);
        }
    });
    it('Opcode 4XKK should skip next instruction if Vx is different than KK', function () {
        let cpu = chip8.buildInitialCpuState();
        let expectedPC = 200;
        cpu.PC = expectedPC;
        for (const opcode of opcodesBetween(0x4000, 0x4FFF)) {
            chip8.executeOpcode(opcode, cpu);

            const Vx = cpu.V[parser.getNibble(opcode, 2)];
            const KK = cpu.V[parser.getByte(opcode, 0)];
            if (Vx !== KK) expectedPC += 2;
            assert.strictEqual(cpu.PC, expectedPC);
        }
    });
    it('Opcode 5XY0 should skip next instruction if Vx is equal to Vy', function () {
        let cpu = chip8.buildInitialCpuState();
        let expectedPC = 200;
        cpu.PC = expectedPC;
        for (const opcode of opcodesBetween(0x5000, 0x5FFF)) {
            chip8.executeOpcode(opcode, cpu);

            const Vx = cpu.V[parser.getNibble(opcode, 2)];
            const Vy = cpu.V[parser.getNibble(opcode, 1)];
            const firstNibble = parser.getNibble(opcode, 0);
            if (Vx === Vy && firstNibble === 0x0) expectedPC += 2;
            assert.strictEqual(cpu.PC, expectedPC);
        }
    });
    it('Opcode 6XNN should set value NN to register X', function () {
        let cpu = chip8.buildInitialCpuState();
        for (const opcode of opcodesBetween(0x6000, 0x6FFF)) {
            chip8.executeOpcode(opcode, cpu);
            assert.strictEqual(cpu.V[(parser.getNibble(opcode, 2))], parser.getByte(opcode, 0));
        }
    });
});

function* opcodesBetween(initialOpcode, finalOpcode, increment = 1) {
    for (let opcode = initialOpcode; opcode <= finalOpcode; opcode += increment) {
        yield opcode;
    }
}