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
const SlashCommand_1 = require("../../managers/SlashCommand");
const Utils_1 = require("../../structures/Utils");
exports.default = new SlashCommand_1.SlashCommand({
    name: '가입',
    category: '도박',
    description: '도박 관련 명령어를 사용할수있게 가입을 합니다.',
    execute: ({ interaction, client }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { guildId, user: { id } } = interaction;
        const user = yield client.models.gambling.findOne({ id, guildId });
        if (user) {
            Utils_1.Utils.reply(interaction, client.messages.gambling.join.alreadyJoin);
            return;
        }
        const name = (_b = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(id)) === null || _b === void 0 ? void 0 : _b.displayName;
        const newUser = new client.models.gambling({ id, name, guildId, stock: [] });
        yield newUser.save();
        interaction.reply(client.messages.gambling.join.success);
    }),
});
