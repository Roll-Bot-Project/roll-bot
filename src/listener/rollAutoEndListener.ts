import {Context, $} from 'koishi'
import {Config} from '../config'

export function rollAutoEndListener(ctx: Context, config: Config) {
  // handle auto end schedule
  ctx.on('ready', async () => {
    const res = await ctx.database.get('roll', {isEnd: 1})
  })
}
