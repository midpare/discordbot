import player from '../../../contexts/player';
import { Command } from '../../../contexts/commands';

export default new Command({
  name: 'skip',
  category: 'music',
  usage: 'skip',
  description: '현재 나오는 노래를 스킵합니다.',
  execute: async ({ msg, args }) => {
    if (!msg.member.voice.channel)
      return msg.reply('채널에 접속해주시기 바랍니다.');

    const queue = player.getQueue(msg.guildId);

    if (!queue)
      return msg.reply('노래가 재생되고 있지 않습니다.');

    queue.skip();

    msg.reply('노래를 스킵합니다.');
  },
});