import { QueryType } from "discord-player"
import player from '../../../clients/player'
import { commandType } from '../../../typings/command'


export = <commandType> {
  name: 'play',
  aliases: ['p'],
  execute: async ({msg, args}) => {

    if (!msg.member.voice.channel) 
      return msg.reply('채널에 접속해주시기 바랍니다.')

    const songTitle = args.join(' ')
    if (!args[0])
      return msg.reply('노래 제목을 입력해주시기 바랍니다.')

    const searchResult = await player.search(songTitle, {
      requestedBy: msg.author,
      searchEngine: QueryType.AUTO
    })

    const queue = player.createQueue(msg.guild, {metadata: msg.channel})
    if (!queue.connection)
      await queue.connect(msg.member.voice.channel)
    
    searchResult.playlist
    ? queue.addTracks(searchResult.tracks)
    : queue.addTrack(searchResult.tracks[0])

    if (!queue.playing) {
      await queue.play() 
      msg.reply(`${searchResult.tracks[0]}을(를) ${msg.member.voice.channel.name}에서 재생합니다!`)
    } else {
      msg.reply(`${searchResult.tracks[0]}을(를) 리스트에 추가합니다!`)
    }
  }
}
