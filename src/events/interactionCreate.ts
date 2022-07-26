import { Client } from '../structures/Client';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, BaseInteraction } from 'discord.js';
import { Event } from '../managers/Event';

export default new Event({
  name: 'interactionCreate',
  execute: async (interaction: BaseInteraction) => {
    const client = <Client>interaction.client;

    if (!interaction.isButton() && !interaction.isSelectMenu())
      return;

    const id = interaction.user.id;

    const options = client.interactionOptions.get(interaction.customId);

    if (!options || options.id != id)
      return;

    const events = client.interactions.get(options.cmd);

    if (!events)
      return;

    try {
      if (options.cmd != 'cancel')
        events.execute({ interaction, options, client });

      for (const id of options.customIds) {
        client.interactionOptions.delete(id)
      }
      options.message.delete();
    } catch (error) {
      console.error(error);
    }
  },
});