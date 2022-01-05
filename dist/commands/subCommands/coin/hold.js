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
const discord_js_1 = require("discord.js");
const Commands_1 = require("../../../structures/Commands");
const Client_1 = require("../../../structures/Client");
const Util_1 = require("../../../structures/Util");
const gambling_1 = require("../../../models/gambling");
exports.default = new Commands_1.Command({
    name: '보유',
    aliases: ['보유량'],
    category: 'coin',
    usage: '코인 보유',
    description: '현재 갖고있는 코인을 확인합니다.',
    execute: ({ msg, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const id = msg.author.id;
        const embed = new discord_js_1.MessageEmbed();
        const user = yield gambling_1.gambling.findOne({ id });
        const stock = user.stock;
        if (!stock[0])
            return msg.reply('보유한 코인이 없습니다.');
        embed
            .setTitle(`${msg.author.username}님의 코인 보유 현황`);
        for (const element of stock) {
            const apiOptions = {
                uri: `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.${Client_1.client.coin.get(element.name)}&count=1&to`,
                method: 'GET',
                json: true,
            };
            const coin = yield (0, Util_1.requestGet)(apiOptions);
            const persent = Math.round((coin[0].tradePrice / element.money - 1) * 100 * 100) / 100;
            const persentShown = persent < 0 ? persent : '+' + persent;
            const profit = Math.round((coin[0].tradePrice - element.money) * element.count);
            const profitShown = profit < 0 ? profit.toLocaleString() : '+' + profit.toLocaleString();
            embed.addField(element.name, `수량: ${element.count}개, 평단가: ${Math.floor(element.money).toLocaleString()}원\n손익: ${profitShown}원(${persentShown}%)`, false);
        }
        msg.channel.send({ embeds: [embed] });
    }),
});