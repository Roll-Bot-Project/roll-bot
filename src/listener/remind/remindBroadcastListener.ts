import {Context, $} from 'koishi'
import {Config} from '../../config'
import {bots} from "../../index";
import { DateTime, Duration } from 'luxon'

export function remindBroadcastListener(ctx: Context, config: Config) {
  ctx.on('roll-bot/remind-broadcast', async (
    rollId,
    remindId?
  ) => {
    let remindRange, d
    if (!remindId) {
      remindRange = await ctx.database.get('roll_channel', {roll_id: rollId})
    } else {
      remindRange = await ctx.database.get('remind_channel', {remind_id: remindId})
    }
    const rollRes = await ctx.database.get('roll', {id: rollId})
    const rollCode = rollRes[0].roll_code
    if (rollRes[0].endTime) {
      const end = DateTime.fromJSDate(rollRes[0].endTime, {zone: 'UTC'})
      const start = DateTime.utc()
      d = end.diff(start, ['minutes'])
    }

    if (rollRes[0].isEnd) return

    for (const item of remindRange) {
      for (const bot of bots) {
        if (bot.platform === item.channel_platform) {
          let locales
          const currentChannel = await ctx.database.get('channel', {id: item.channel_id, platform: item.channel_platform})
          if (currentChannel[0].locales.length === 0) {
            locales = ctx.root.options.i18n.locales
          } else {
            locales = currentChannel[0].locales
          }
          if (rollRes[0].endTime) {
            const diff = d.set({minutes: Math.floor(d.minutes)}).reconfigure({locale: locales[0]}).rescale().toHuman()
            const msg = ctx.i18n.render(locales, ['events.remind.broadcast.messageWithDiff'], {
              rollCode: rollCode,
              diff: diff
            })[0]
            bot.sendMessage(item.channel_id, msg)
          } else {
            const msg = ctx.i18n.render(locales, ['events.remind.broadcast.message'], {
              rollCode: rollCode
            })[0]
            bot.sendMessage(item.channel_id, msg)
          }
        }
      }
    }
  })
}
