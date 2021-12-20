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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var gambling_1 = require("../../../models/gambling");
module.exports = {
    name: '대출',
    category: 'gambling',
    use: '대출 <돈>',
    description: '최대 100만원까지의 돈을 대출합니다.',
    execute: function (_a) {
        var msg = _a.msg, args = _a.args;
        return __awaiter(void 0, void 0, void 0, function () {
            var id, user, debt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = msg.author.id;
                        return [4 /*yield*/, gambling_1.gambling.findOne({ id: id })];
                    case 1:
                        user = _b.sent();
                        if (!args[0])
                            return [2 /*return*/, msg.reply('정확한 금액을 입력해주시기바랍니다.')];
                        debt = parseFloat(args[0]);
                        if (!Number.isInteger(debt) || debt <= 0)
                            return [2 /*return*/, msg.reply('정확한 금액를 입력해주시기바랍니다')];
                        if (user.debt + debt > 1000000)
                            return [2 /*return*/, msg.reply("100\uB9CC\uC6D0\uC744 \uCD08\uACFC\uD558\uB294 \uBE5A\uC740 \uBE4C\uB9B4\uC218 \uC5C6\uC2B5\uB2C8\uB2E4.")];
                        gambling_1.gambling.updateOne({ id: id }, { $inc: { debt: debt, money: debt } }).then(function () {
                            msg.reply("\uC131\uACF5\uC801\uC73C\uB85C " + debt.toLocaleString() + "\uC6D0\uC744 \uB300\uCD9C\uD588\uC2B5\uB2C8\uB2E4!\n \uD604\uC7AC \uB300\uCD9C\uAE08\uC561 " + user.debt.toLocaleString() + "\uC6D0 -> " + (user.debt + debt).toLocaleString() + "\uC6D0");
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
};