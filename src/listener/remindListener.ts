import {Context, $} from 'koishi'
import {Config} from '../config'

export function remindListener(ctx: Context, config: Config) {
  ctx.on('ready', async () => {
    const remindRes = await ctx.database
      .join(['remind', 'reminder'], (row) => $.eq(remind.reminder_id, reminder.id))
      .execute()
    for (const remind of remindRes) {

    }
  })

  ctx.on('roll-bot/remind-broadcast', () => {

  })
}
