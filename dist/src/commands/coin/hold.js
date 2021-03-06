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
const Commands_1 = require("../../managers/Commands");
const Utils_1 = require("../../structures/Utils");
exports.default = new Commands_1.Command({
    name: '코인 보유',
    aliases: ['코인 보유량'],
    category: '코인',
    usage: '코인 보유',
    description: '현재 갖고있는 코인을 확인합니다.',
    execute: ({ msg, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const id = msg.author.id;
        const embed = new discord_js_1.EmbedBuilder();
        const user = yield client.models.gambling.findOne({ id });
        const stock = user.stock;
        if (!stock[0]) {
            msg.reply('보유한 코인이 없습니다.');
            return;
        }
        embed
            .setTitle(`${msg.author.username}님의 코인 보유 현황`);
        for (const element of stock) {
            const apiOptions = {
                uri: `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.${client.coin.get(element.name)}&count=1&to`,
                method: 'GET',
                json: true,
            };
            const coin = yield Utils_1.Utils.requestGet(apiOptions);
            const persent = Math.round((coin[0].tradePrice / element.money - 1) * 100 * 100) / 100;
            const persentShown = persent < 0 ? persent : '+' + persent;
            const profit = Math.round((coin[0].tradePrice - element.money) * element.count);
            const profitShown = profit < 0 ? profit.toLocaleString() : '+' + profit.toLocaleString();
            embed.addFields({ name: element.name, value: `수량: ${element.count}개, 평단가: ${Math.floor(element.money).toLocaleString()}원\n손익: ${profitShown}원(${persentShown}%)`, inline: false });
        }
        msg.channel.send({ embeds: [embed] });
    }),
});
