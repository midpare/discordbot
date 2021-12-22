import { glob } from 'glob'
import { promisify } from 'util'
import { ExtendClient } from '../context/client'

const globPromise = promisify(glob)

export = async function (client: ExtendClient) {
  const eventFiles = await globPromise(`${__dirname}/../events/**/*{.ts,.js}`)
  eventFiles.forEach((value) => {
    const file = require(value)
    client.on(file.name, file.event)
  })
}