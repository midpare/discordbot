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
const Commands_1 = require("../../../managers/Commands");
const Utils_1 = require("../../../structures/Utils");
exports.default = new Commands_1.Command({
    name: '망언 삭제',
    private: true,
    execute: ({ msg, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const target = (_a = msg.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
        if (!target) {
            Utils_1.Utils.reply(msg, client.messages.missingMentionUser('망언을 삭제'));
            return;
        }
        const { id, guild: { id: guildId } } = target;
        if (!args[1]) {
            Utils_1.Utils.reply(msg, '지울 망언의 내용을 작성해주시기 바랍니다.');
            return;
        }
        const content = args.slice(1).join(' ');
        const user = yield client.models.config.findOne({ id, guildId });
        if (!user.slangs.includes(content)) {
            Utils_1.Utils.reply(msg, '이 유저는 이 망언을 보유하고 있지 않습니다.');
            return;
        }
        (yield client.models.config.updateOne({ id, guildId }, { $pull: { slangs: content } })).matchedCount;
        Utils_1.Utils.reply(msg, `성공적으로 망언을 삭제했습니다!\n망언 내용: ${content}`);
    })
});
