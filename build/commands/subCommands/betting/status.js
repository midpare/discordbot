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
const discord_js_1 = require("discord.js");
const betting_1 = require("../../../typings/betting");
module.exports = {
    name: '현황',
    category: 'betting',
    execute: ({ msg, args }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!betting_1.betting.betting)
            return msg.reply('아직 베팅을 시작하지 않았습니다.');
        const embed = new discord_js_1.MessageEmbed();
        let persent;
        if (betting_1.bet1.sum == 0)
            persent = 0;
        else
            persent = (betting_1.bet1.sum / (betting_1.bet1.sum + betting_1.bet2.sum) * 100);
        betting_1.bet1.times = Math.round(100 / (persent) * 100) / 100;
        if (persent == 100)
            betting_1.bet2.times = 0;
        else
            betting_1.bet2.times = Math.round(100 / (100 - persent) * 100) / 100;
        embed
            .setTitle("베팅 현황")
            .setDescription("베팅 현황을 확인합니다.")
            .setFields({ name: `${betting_1.bet1.name}`, value: `${betting_1.bet1.sum.toLocaleString()}원(${Math.round(persent)}%) \n참여인원: ${betting_1.bet1.list.length.toLocaleString()}명 \n배율: ${betting_1.bet1.times}배`, inline: true }, { name: `${betting_1.bet2.name}`, value: `${betting_1.bet2.sum.toLocaleString()}원(${Math.round(100 - persent)}%) \n참여인원: ${betting_1.bet2.list.length.toLocaleString()}명 \n배율: ${betting_1.bet2.times}배`, inline: true });
        msg.channel.send({ embeds: [embed] });
    })
};
