exports.executeOpcode = function(opcode, cpu) {
    if (opcode.startsWith('6')) {
        let register = opcode.substr(1, 1);
        let value = opcode.substr(2, 2);
        cpu.V[register] = parseInt(value, 16);
    }
};

exports.buildInitialCpuState = function() {
    return {
        V: new Uint8Array(16), // General Registers: 8 bits
        I: 0,                         // Address: 16 bits
    };
};
