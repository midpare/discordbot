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
exports.BetNode = exports.Betting = void 0;
class Betting {
    constructor(title, name1, name2, client) {
        this.title = title;
        this.bet1 = new BetNode(name1, client);
        this.bet2 = new BetNode(name2, client);
        this.client = client;
    }
    get persent() {
        const returner = {
            bet1: 0,
            bet2: 0,
        };
        if (this.bet1.sum == 0 && this.bet2.sum == 0)
            return returner;
        const persent = (this.bet1.sum / (this.bet1.sum + this.bet2.sum) * 100);
        returner.bet1 = persent;
        returner.bet2 = 100 - persent;
        return returner;
    }
    get times() {
        const returner = {
            bet1: 0,
            bet2: 0,
        };
        if (this.bet1.sum != 0)
            returner.bet1 = 100 / (this.persent.bet1);
        if (this.bet2.sum != 0)
            returner.bet2 = 100 / (this.persent.bet2);
        return returner;
    }
    end(winner) {
        return __awaiter(this, void 0, void 0, function* () {
            const winnerNode = this[winner];
            for (const user of winnerNode.user) {
                const id = user.id;
                const result = user.money * this.times[winner];
                (yield this.client.models.gambling.updateOne({ id }, { $inc: { money: result } })).matchedCount;
            }
        });
    }
}
exports.Betting = Betting;
class BetNode {
    constructor(name, client) {
        this.name = name;
        this.user = new Array();
        this.client = client;
    }
    addUser(msg, bettor, money) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = bettor.id;
            const name = bettor.username;
            const user = yield this.client.models.gambling.findOne({ id });
            if (money > user.money)
                return msg.reply(`????????? ????????? ???????????? ???????????? ??? ????????????. \n?????? ??????: ${user.money.toLocaleString()}???`);
            const posArr = this.user.find((element) => element.id = id);
            if (!posArr) {
                this.user.push({ id, money });
                msg.reply(`${name}?????? '${this.name}'??? ${money.toLocaleString()}?????? ??????????????????! \n???????????? ${user.money.toLocaleString()}??? -> ${(user.money - money).toLocaleString()}???`);
            }
            else {
                if (posArr.money + money < 0)
                    return msg.reply(`??????????????? ??? ????????? ??? ?????? ???????????? \n?????? ?????????: ${posArr.money.toLocaleString()}`);
                posArr.money += money;
                msg.reply(`${name}?????? '${this.name}'??? ${money.toLocaleString()}?????? ????????? ??????????????????! \n?????? ?????????: ${(posArr.money - money).toLocaleString()}??? -> ${posArr.money.toLocaleString()}??? \n?????? ?????? ${user.money.toLocaleString()}??? -> ${(user.money - money).toLocaleString()}???`);
            }
            (yield this.client.models.gambling.updateOne({ id }, { $inc: { money: -money } })).matchedCount;
        });
    }
    get sum() {
        let result = 0;
        for (const user of this.user) {
            result += user.money;
        }
        return result;
    }
}
exports.BetNode = BetNode;
