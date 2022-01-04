"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("../../../structures/Commands");
exports.default = new Commands_1.Command({
    name: 'ping',
    category: 'normal',
    usage: 'ping',
    description: '봇의 작동가능여부를 확인합니다.',
    execute: ({ msg, args }) => {
        msg.reply('pong!');
    },
});
