import { Interaction } from '../managers/Interaction';
import { ButtonInteraction, GuildMemberRoleManager, TextChannel } from 'discord.js';

export default new Interaction<ButtonInteraction>({
  name: 'giveRole',
  deleted: false,
  execute: async ({ interaction, client }) => {
    const roles = <GuildMemberRoleManager>interaction.member?.roles

    roles.add('910521119713394743');
    roles.remove('910521119713394739');

    interaction.channel?.send('성공적으로 역할을 지급받았습니다!').then((msg) => {
      setTimeout(() => msg.delete(), 2000);
    });
    const channel = <TextChannel>client.channels.cache.get('910521192039989288');
    channel.send(`${interaction.user.username}#${interaction.user.discriminator}님이 서버에 입장하였습니다!`);
  }
});