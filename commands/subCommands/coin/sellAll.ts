import { CommandType } from "../../../typings/command"
import { gambling } from "../../../models/gambling"
import { requestGet } from "../../../handler/function"
import client from "../../../clients/client"

export = <CommandType> {
  name: '풀매수',
  aliases: ['전부구매'],
  category: 'coin',
  execute: async ({msg, args}) => {
    const id = msg.author.id
    const user = await gambling.findOne({id})
    const stock = user.stock
    const coinName = args[1]
    const userCoin = stock.filter((element: { name: string }) => element.name == coinName)[0]
    const coin: any = await requestGet({ uri: `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.${client.coin.get(coinName)}&count=1&to` })
    if (!coinName)
    return msg.reply('정확한 코인을 입력해주시기바랍니다.')
    const coinMoney = coin[0].tradePrice
    const count = Math.floor(user.money / coinMoney)
    const money = coinMoney * count 
    if (userCoin) {
      const moneyAve = (userCoin.money * userCoin.count + money) / (userCoin.count + count)
      gambling.updateOne({id, stock: userCoin}, {$set: {'stock.$.money': moneyAve}, $inc: {'stock.$.count': count, money: Math.round(-money)}}).then(() => {
        msg.reply(`성공적으로 ${coinName} ${count.toLocaleString()}개를 ${money.toLocaleString()}원(개당 ${coinMoney.toLocaleString()}원)에 추가로 구매했습니다!\n현재 평단가: ${userCoin.money.toLocaleString()}원 -> ${(Math.floor(moneyAve * 100) / 100).toLocaleString()}원\n현재 구매량: ${userCoin.count}개 -> ${(userCoin.count + count).toLocaleString()}개`)
      })
    } else {
      const stockObject = {
        name: coinName,
        count: count,
        money: coinMoney
      }
      gambling.updateOne({id}, {$push: {stock: stockObject}, $inc: {money: Math.round(-money)}}).then(() => {
        msg.reply(`성공적으로 ${coinName} ${count.toLocaleString()}개를 ${(money).toLocaleString()}원(개당 ${coinMoney.toLocaleString()}원)에 구매했습니다!`)
      })
    }
  }
}