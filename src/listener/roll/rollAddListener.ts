import {Context} from 'koishi'
import {Config} from '../../config'
import {autoEndManager, globalState, initialId, remindManager} from "../../index";
import {getRemindValueFromDefaultReminder} from "../../util/general";

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

    ctx.emit('roll-bot/roll-key-update')
    // Apply default reminds
    for (const defaultRemind of config.remind.defaultReminders) {
      if (roll.endTime || defaultRemind.type != '1') {
        autoEndManager.addJob(globalState.rollAutoEndInitialId, getRemindValueFromDefaultReminder(roll.endTime, defaultRemind, config), function () {
          ctx.emit('roll-bot/remind-broadcast', roll.id)
        })
        globalState.rollAutoEndInitialId++
      }
    }
    // Create auto end job
    if (roll.endTime) {
      autoEndManager.addJob(globalState.rollAutoEndInitialId, roll.endTime, function () {
        ctx.emit('roll-bot/roll-end', roll.id)
      })
    }
  })
}
