const parser = require('./dataParser');

// http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.1
exports.executeOpcode = function(opcode, cpu) {
    let Vx, Vy, KK;
    switch (parser.getNibble(opcode, 3)) {
        case 0x0:
            // 0nnn - SYS addr
            // Jump to a machine code routine at nnn.
            //
            // This instruction is only used on the old computers on which Chip-8 was originally implemented. It is ignored by modern interpreters.

            // 00E0 - CLS
            // Clear the display.
            if (opcode === 0x00E0)
                throw "CLS not implemented yet";

            // 00EE - RET
            // Return from a subroutine.
            //
            // The interpreter sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.
            if (opcode === 0x00EE) {
                cpu.SP -= 1;
                cpu.PC = cpu.stack[cpu.SP];
            }

            break;
        case 0x1:
            // 1nnn - JP addr
            // Jump to location nnn.
            //
            // The interpreter sets the program counter to nnn.
            cpu.PC = opcode & 0x0FFF;
            break;
        case 0x2:
            // 2nnn - CALL addr
            // Call subroutine at nnn.
            //
            // The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.
            cpu.stack[cpu.SP] = cpu.PC += 2;
            cpu.SP += 1;
            cpu.PC = opcode & 0x0FFF;
            break;
        case 0x3:
            // 3xkk - SE Vx, byte
            // Skip next instruction if Vx = kk.
            //
            // The interpreter compares register Vx to kk, and if they are equal, increments the program counter by 2.
            Vx = cpu.V[parser.getNibble(opcode, 2)];
            KK = cpu.V[parser.getByte(opcode, 0)];
            if (Vx === KK) cpu.PC += 2;
            break;
        case 0x4:
            // 4xkk - SNE Vx, byte
            // Skip next instruction if Vx != kk.
            //
            // The interpreter compares register Vx to kk, and if they are not equal, increments the program counter by 2.
            Vx = cpu.V[parser.getNibble(opcode, 2)];
            KK = cpu.V[parser.getByte(opcode, 0)];
            if (Vx !== KK) cpu.PC += 2;
            break;
        case 0x5:
            // 5xy0 - SE Vx, Vy
            // Skip next instruction if Vx = Vy.
            //
            // The interpreter compares register Vx to register Vy, and if they are equal, increments the program counter by 2.
            if (parser.getNibble(opcode, 0) !== 0x0) break;
            Vx = cpu.V[parser.getNibble(opcode, 2)];
            Vy = cpu.V[parser.getNibble(opcode, 1)];
            if (Vx === Vy) cpu.PC += 2;
            break;
        case 0x6:
            // 6xkk - LD Vx, byte
            // Set Vx = kk.
            //
            // The interpreter puts the value kk into register Vx.
            cpu.V[parser.getNibble(opcode, 2)] = parser.getByte(opcode, 0);
            break;
        case 0x7:
        case 0x8:
        case 0x9:
        case 0xA:
        case 0xB:
        case 0xC:
        case 0xD:
        case 0xE:
        case 0xF:
        default:
    }
};

exports.buildInitialCpuState = function() {
    return {
        V: new Uint8Array(16),      // General Registers: 8 bits
        I: 0,                       // Memory Address: 16 bits
        PC: 0,                      // Program Counter: 16 bits
        SP: 0,                      // Stack Pointer: 16 bits
        stack: new Uint16Array(16), // Stack
    };
};
