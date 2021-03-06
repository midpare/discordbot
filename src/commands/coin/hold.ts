import { EmbedBuilder } from 'discord.js';
import { Command } from '../../managers/Commands';
import { Utils } from '../../structures/Utils';

export default new Command({
  name: '코인 보유',
  aliases: ['코인 보유량'],
  category: '코인',
  usage: '코인 보유',
  description: '현재 갖고있는 코인을 확인합니다.',
  execute: async ({ msg, client }) => {
    const id = msg.author.id;
    const embed = new EmbedBuilder();
    const user = await client.models.gambling.findOne({ id });
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

      const coin = await Utils.requestGet(apiOptions);
      const persent = Math.round((coin[0].tradePrice / element.money - 1) * 100 * 100) / 100;
      const persentShown = persent < 0 ? persent : '+' + persent;

      const profit = Math.round((coin[0].tradePrice - element.money) * element.count);
      const profitShown = profit < 0 ? profit.toLocaleString() : '+' + profit.toLocaleString();
      embed.addFields({ name: element.name, value: `수량: ${element.count}개, 평단가: ${Math.floor(element.money).toLocaleString()}원\n손익: ${profitShown}원(${persentShown}%)`, inline: false});
    }
    msg.channel.send({ embeds: [embed] });
  },
});