import {Context, $} from 'koishi'
import {Config} from '../config'

export function reminderDeleteListener(ctx: Context, config: Config) {
  ctx.on('roll-bot/reminder-delete', async (
    session,
    reminderId
  ) => {
    ctx.database.remove('user_reminder', {user_id: session.user.id, reminder_id: reminderId})
    const userReminderRes = await ctx.database.get('user_reminder', {reminder_id: reminderId})
    if (userReminderRes.length === 0) {
      ctx.database.remove('reminder', [reminderId])
    }
  })
}
