import { gambling } from '../../../models/gambling'
import { commandType } from '../../../typings/command'

export = <commandType> {
  name : 'rsp',
  execute: async ({msg, args}) => {
    const id = msg.author.id
    const user = await gambling.findOne({id})
    if (!user)
      return msg.reply('가입되지 않은 유저입니다 !가입 을 통해 가입해주시기 바랍니다.')
    
    if (user.gamLevel % 2 != 0)
      return msg.reply('이 도박을 할 수 있는 권한이 없습니다 \n!상점에서 도박권을 구매하십시오')

    const money = parseFloat(args[1])
    if (isNaN(money))
      return msg.reply('베팅할 돈을 입력해주시기바랍니다.')
    
    if (money > user.money)
      return msg.reply('현재 잔액보다 높은돈을 입력하실수없습니다.')

    const rspArgs = ['가위', '바위', '보']
    const even = (element: string) => msg.content.includes(element)

    if (!rspArgs.some(even))
      return msg.reply('가위, 바위, 보 중 하나를 입력해주시기바랍니다.\n !rsp <가위/바위/보> <돈>')
    const random = Math.floor(Math.random() * 3)
    const human = args[0]
    const bot = rspArgs[random]
  
    let winner: string = ''

    if (human === bot) {
      winner = '비김'
    } else {
      human === '보' ?  (winner = bot === '가위' ? '봇' : '인간') : ''
      human === '가위' ?  (winner = bot === '바위' ? '봇' : '인간') : ''
      human === '바위' ?  (winner = bot === '보' ? '봇' : '인간') : ''
    }

    if (winner === '비김') {
      gambling.updateOne({ id }, { $inc: { money: money * -0.4 } })
        .then(() => msg.reply(`사람: ${human} 봇: ${bot}\n비겼습니다.\n${money * 0.4}원를 잃게됩니다.\n잔액: ${user.money}원 -> ${user.money - money * 0.4}원`))

    }

    if (winner === '봇') {
      gambling.updateOne({ id }, { $inc: { money: -money } })
        .then(() => msg.reply(`사람: ${human} 봇: ${bot}\n${winner}이 승리했습니다.\n${money}원을 잃게 됩니다.\n잔액: ${user.money}원 -> ${user.money - money}원`))
    }

    if (winner === '인간') {
      gambling.updateOne({ id }, { $inc: { money: money * 1.5 } })
        .then(() => msg.reply(`사람: ${human} 봇: ${bot}\n${winner}이 승리했습니다.\n${money * 1.5}원을 얻었습니다.\n잔액: ${user.money}원 -> ${user.money + money * 1.5}원`))
    }
  }
}