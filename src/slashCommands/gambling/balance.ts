import { SlashCommand } from '../../managers/SlashCommand';

export default new SlashCommand({
  name: '잔액',
  aliases: ['ㅈㅇ', '보유금액'],
  category: '도박',
  description: '자신의 현재 잔액을 확인합니다.',
  execute: async ({ interaction, client }) => {
    const { guildId, user: { id } } = interaction;
    const user = await client.models.gambling.findOne({ id, guildId });
    interaction.reply(client.messages.gambling.balance(user.name, user.money));
  },
});