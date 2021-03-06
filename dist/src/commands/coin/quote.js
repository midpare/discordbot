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
const Commands_1 = require("../../managers/Commands");
const discord_js_1 = require("discord.js");
exports.default = new Commands_1.Command({
    name: '코인 현황',
    aliases: ['코인 시세', '코인 가격'],
    category: '코인',
    usage: '코인 현황',
    description: '현재 코인들의 현황을 업비트에서 확인합니다.',
    execute: ({ msg }) => __awaiter(void 0, void 0, void 0, function* () {
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setURL('https://upbit.com/exchange')
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setLabel('거래소'));
        msg.channel.send({ content: '이곳을 눌러 현황을 확인하세요', components: [row] });
    }),
});
