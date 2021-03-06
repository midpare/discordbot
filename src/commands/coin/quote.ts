import { Command } from '../../managers/Commands';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default new Command({
  name: '코인 현황',
  aliases: ['코인 시세', '코인 가격'],
  category: '코인',
  usage: '코인 현황',
  description: '현재 코인들의 현황을 업비트에서 확인합니다.',
  execute: async ({ msg }) => {
    const row = <ActionRowBuilder<ButtonBuilder>>new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL('https://upbit.com/exchange')
        .setStyle(ButtonStyle.Link)
        .setLabel('거래소')
    );
    msg.channel.send({ content: '이곳을 눌러 현황을 확인하세요', components: [row] });
  },
});