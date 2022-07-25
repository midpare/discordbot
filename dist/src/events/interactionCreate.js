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
const Event_1 = require("../managers/Event");
exports.default = new Event_1.Event({
    name: 'interactionCreate',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const client = interaction.client;
        if (!(interaction instanceof discord_js_1.ButtonInteraction || interaction instanceof discord_js_1.SelectMenuInteraction))
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
                client.interactionOptions.delete(id);
            }
            options.message.delete();
        }
        catch (error) {
            console.error(error);
        }
    }),
});
