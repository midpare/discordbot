import player from "../../../clients/player"
import { commandType } from '../../../typings/command'

export = <commandType> {
  name: 'pause',
  execute: async ({msg, args}) => {
    if (!msg.member.voice.channel)
      return msg.reply('채널에 접속해주시기 바랍니다.')

    const queue = player.getQueue(msg.guildId)

    if (!queue)
      return msg.reply('노래가 재생되고 있지 않습니다.')
    
    queue.setPaused(true)

    msg.reply('노래를 정지합니다.')
  }
}