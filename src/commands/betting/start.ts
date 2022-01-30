import { Command } from '../../structures/Commands';
import { bet1, bet2, betting } from '../../structures/game/Betting'
import { MessageEmbed } from 'discord.js';

export default new Command({
  name: '베팅 시작',
  aliases: ['베팅 스타트'],
  category: '베팅',
  usage: '베팅 시작 <제목> <팀1> <팀2>',
  description: '베팅을 시작합니다.',
  execute: async ({ msg, args }) => {
    if (betting.betting)
      return msg.reply('이미 시작한 베팅이 있습니다.');

    if (!args[0])
      return msg.reply('제목을 입력해주시기바랍니다.');

    if (!args[1] || !args[2])
      return msg.reply('베팅 이름을 입력해주시기바랍니다.');

    const embed = new MessageEmbed();
    betting.title = args[0];
    bet1.name = args[1];
    bet2.name = args[2];

    embed
      .setTitle(betting.title)
      .setDescription(`${bet1.name}와 ${bet2.name}중 베팅해주시기바랍니다.`)
      .addFields(
        { name: `${bet1.name}`, value: `!베팅 ${bet1.name} 로 베팅해주시기바랍니다.`, inline: true },
        { name: `${bet2.name}`, value: `!베팅 ${bet2.name} 로 베팅해주시기바랍니다.`, inline: true },
      );
    msg.channel.send({ embeds: [embed] });
    betting.betting = true;
  },
})