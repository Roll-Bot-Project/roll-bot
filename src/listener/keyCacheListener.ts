import {Context} from 'koishi'
import {Config} from '../config'
import {rollKeyCache} from '../index'

export function keyCacheListener(ctx: Context, config: Config) {
  // init
  ctx.on('ready', async () => {
    rollKeyCache.content = await ctx.database.get('roll', {})
  })

  ctx.on('roll-bot/roll-key-update', async () => {
    rollKeyCache.content = await ctx.database.get('roll', {})
  })
}
