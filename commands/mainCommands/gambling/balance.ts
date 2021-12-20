import { gambling } from '../../../models/gambling'
import { CommandType } from '../../../typings/command'

export = <CommandType> {
  name : '잔액',
  aliases: ['돈', '보유금액'],
  category: 'gambling',
  use: '잔액',
  description: '자신의 현재 잔액을 확인합니다.',
  execute: async ({msg, args}) => {
    const id = msg.author.id 
    const user = await gambling.findOne({id})
    msg.reply(`${user.name} 님의 잔액은 ${user.money.toLocaleString()}원입니다.`)
  }
}