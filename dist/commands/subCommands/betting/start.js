"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("../../../structures/Commands");
const Betting_1 = require("../../../structures/Betting");
const discord_js_1 = require("discord.js");
exports.default = new Commands_1.Command({
    name: '시작',
    aliases: ['스타트'],
    category: 'betting',
    usage: '베팅 시작 <제목> <팀1> <팀2>',
    description: '베팅을 시작합니다.',
    execute: ({ msg, args }) => __awaiter(void 0, void 0, void 0, function* () {
        if (Betting_1.betting.betting)
            return msg.reply('이미 시작한 베팅이 있습니다.');
        if (!args[1])
            return msg.reply('제목을 입력해주시기바랍니다.');
        if (!args[2] || !args[3])
            return msg.reply('베팅 이름을 입력해주시기바랍니다.');
        const embed = new discord_js_1.MessageEmbed();
        Betting_1.betting.title = args[1];
        Betting_1.bet1.name = args[2];
        Betting_1.bet2.name = args[3];
        embed
            .setTitle(Betting_1.betting.title)
            .setDescription(`${Betting_1.bet1.name}와 ${Betting_1.bet2.name}중 베팅해주시기바랍니다.`)
            .addFields({ name: `${Betting_1.bet1.name}`, value: `!베팅 ${Betting_1.bet1.name} 로 베팅해주시기바랍니다.`, inline: true }, { name: `${Betting_1.bet2.name}`, value: `!베팅 ${Betting_1.bet2.name} 로 베팅해주시기바랍니다.`, inline: true });
        msg.channel.send({ embeds: [embed] });
        Betting_1.betting.betting = true;
    }),
});