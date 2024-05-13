import {Context} from 'koishi'
import {Config} from '../config'

export function rollAddListener(ctx: Context, config: Config) {
  ctx.on('roll-bot/roll-add', async (
    session,
    roll,
    prizes,
    reminder
  ) => {
    // Write to database
    const rollRes = await ctx.database.create('roll', roll)

    for (let prize of prizes) {
      const prizeRes = await ctx.database.create('prize', prize)
      await ctx.database.create('roll_prize', {
        roll_id: rollRes.id,
        prize_id: prizeRes.id
      })
    }

    await ctx.database.create('roll_creator', {
      roll_id: rollRes.id,
      user_id: session.user.id
    })
    await ctx.database.create('roll_channel', {
      roll_id: rollRes.id,
      channel_id: session.channelId,
      channel_platform: session.event.platform
    })

    // Apply default reminds
    ctx.emit('roll-bot/reminder-add',session)
    // Create auto end if true

  })
}
