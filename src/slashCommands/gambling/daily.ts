import { SlashCommand } from '../../managers/SlashCommand';
import { Utils } from '../../structures/Utils';

export default new SlashCommand({
  name: '출석체크',
  aliases: ['출첵', 'ㅊㅊ'],
  category: '도박',
  description: '하루에 한번 50,000 ~ 100,000만원의 돈을 획득합니다.',
  execute: async ({ interaction, client }) => {
    const { guildId, user: { id } } = interaction;
    const user = await client.models.gambling.findOne({ id, guildId });

    const date = new Date();
    const today = '' + date.getFullYear() + date.getMonth() + date.getDate();

    if (user.date == today) {
      Utils.reply(interaction, client.messages.gambling.daily.today);
      return;
    }

    const money = Math.floor(Math.random() * 50000 + 50000);
    (await client.models.gambling.updateOne({ id, guildId }, { $inc: { money }, $set: { date: today } })).matchedCount;
    interaction.reply(client.messages.gambling.daily.success(user.money, money));
  },
});