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
const SlashCommand_1 = require("../../managers/SlashCommand");
const Utils_1 = require("../../structures/Utils");
exports.default = new SlashCommand_1.SlashCommand({
    name: '강퇴',
    aliases: ['킥', 'kick'],
    category: '관리자',
    usage: '강퇴 <유저> [사유]',
    description: '서버에서 맨션한 <유저>를 강퇴합니다.',
    options: [
        {
            name: '유저',
            description: '강퇴할 유저를 입력합니다.',
            type: discord_js_1.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: '사유',
            description: '사유를 입력합니다.',
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    default_member_permissions: discord_js_1.PermissionFlagsBits.KickMembers,
    execute: ({ interaction, options, client }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const channel = client.channels.cache.get('910521119877005363');
        const target = options.getMember('유저');
        const reason = (_a = options.getString('사유')) !== null && _a !== void 0 ? _a : '';
        if (!(target instanceof discord_js_1.GuildMember)) {
            Utils_1.Utils.reply(interaction, client.messages.admin.kick.missingMentionUser);
            return;
        }
        if (target.permissions.has(discord_js_1.PermissionFlagsBits.KickMembers)) {
            interaction.reply(client.messages.admin.kick.missingPermissionTarget);
            return;
        }
        target.kick(reason);
        channel.send(client.messages.admin.kick.success(target.user, reason));
        Utils_1.Utils.reply(interaction, `성공적으로 ${target.displayName}님을 강퇴했습니다!`);
    }),
});
