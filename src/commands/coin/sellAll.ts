import { Command } from '../../managers/Commands';
import { Utils } from '../../structures/Utils';

export default new Command({
  name: '코인 풀매수',
  aliases: ['코인 전부구매'],
  category: '코인',
  usage: '코인 풀매수 <코인이름>',
  description: '갖고있는 모든 돈으로 코인을 구매합니다.',
  execute: async ({ msg, args, client }) => {
    const id = msg.author.id;
    const user = await client.models.gambling.findOne({ id });
    const stock = user.stock;
    const coinName = args[0];
    const userCoin = stock.filter((element: { name: string }) => element.name == coinName)[0];
    const apiOptions = {
      uri: `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.${client.coin.get(coinName)}&count=1&to`,
      method: 'GET',
      json: true,
    };
    const coin = await Utils.requestGet(apiOptions);
    if (!coinName) {
      msg.reply('정확한 코인을 입력해주시기바랍니다.');
      return;
    }
    const coinMoney = coin[0].tradePrice;
    const count = Math.floor(user.money / coinMoney);
    const money = coinMoney * count;
    if (userCoin) {
      const moneyAve = (userCoin.money * userCoin.count + money) / (userCoin.count + count);
      await client.models.gambling.updateOne({ id, stock: userCoin }, { $set: { 'stock.$.money': moneyAve }, $inc: { 'stock.$.count': count, money: Math.round(-money) } });
      msg.reply(`성공적으로 ${coinName} ${count.toLocaleString()}개를 ${money.toLocaleString()}원(개당 ${coinMoney.toLocaleString()}원)에 추가로 구매했습니다!\n현재 평단가: ${userCoin.money.toLocaleString()}원 -> ${(Math.floor(moneyAve * 100) / 100).toLocaleString()}원\n현재 구매량: ${userCoin.count}개 -> ${(userCoin.count + count).toLocaleString()}개`);
    } else {
      const stockObject = {
        name: coinName,
        count: count,
        money: coinMoney,
      };
      (await client.models.gambling.updateOne({ id }, { $push: { stock: stockObject }, $inc: { money: Math.round(-money) } })).matchedCount;
      msg.reply(`성공적으로 ${coinName} ${count.toLocaleString()}개를 ${(money).toLocaleString()}원(개당 ${coinMoney.toLocaleString()}원)에 구매했습니다!`);
    }
  },
});