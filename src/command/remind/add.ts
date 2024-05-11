import { Context } from 'koishi';
import { Config } from '../../config';
import { DateTime, Duration } from 'luxon';
import {schedule} from "../../index";
import {getCurrentUTCOffset} from "../../util/time";
import {generateUniqueCode} from "../../util/general";

export function addRemind(ctx: Context, config: Config) {
  ctx.command("remind.add")
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {
      const offset = await getCurrentUTCOffset(ctx, session, config)
      const rule = new schedule.RecurrenceRule()
      let time, duration
      await session.send(session.text('.type'))
      const type = await session.prompt()
      if (!type) return session.text('commands.timeout')

      if (type === '0') {
        // specified
        const regex = /\d{4}-\d{1,2}-\d{1,2}-\d{1,2}(-\d{1,2})?/
        await session.send(session.text('.specified', [offset]))
        const input = await session.prompt()

        if (!input) return session.text('commands.timeout')
        else if (!regex.test(input)) return session.text('.timeError')

        const timeArray = input.split('-')
        let t
        if (timeArray.length === 4) {
          t = {year: timeArray[0], month: timeArray[1],day: timeArray[2], hour: timeArray[3]}
        } else {
          t = {year: timeArray[0], month: timeArray[1],day: timeArray[2], hour: timeArray[3], minute: timeArray[4]}
        }
        time = DateTime.fromObject(t, { zone: offset }).toUTC()
      } else if (type === '1') {
        // before end
        const regex = /\d{1,4}-\d{1,2}-\d{1,2}-\d{1,2}(-\d{1,2})?/
        await session.send(session.text('.before-end', [offset]))
        const input = await session.prompt()

        if (!input) return session.text('commands.timeout')
        else if (!regex.test(input)) return session.text('.timeError')

        const timeArray = input.split('-')
        let t
        if (timeArray.length === 4) {
          t = {years: timeArray[0], months: timeArray[1],days: timeArray[2], hours: timeArray[3]}
        } else {
          t = {years: timeArray[0], months: timeArray[1],days: timeArray[2], hours: timeArray[3], minutes: timeArray[4]}
        }
        duration = Duration.fromObject(t)
      } else if (type === '2') {
        // interval
        await session.send(session.text('.interval.select'))
        const select = await session.prompt()

        if (select === '0') {
          const regex = /\d{1,2}-\d{1,2}-\d{1,2}(-\d{1,2})?/
          await session.send(session.text('.interval.per-year', [offset]))
          const input = await session.prompt()
          if (!input) return session.text('commands.timeout')
          else if (!regex.test(input)) return session.text('.timeError')

          const ruleArray = input.split('-')
          rule.month = ruleArray[0]
          rule.day = ruleArray[1]
          rule.hour = ruleArray[2]
          if (ruleArray.length === 4) rule.minute = ruleArray[3]
        } else if (select === '1') {
          const regex = /\d{1,2}-\d{1,2}(-\d{1,2})?/
          await session.send(session.text('.interval.per-month', [offset]))
          const input = await session.prompt()
          if (!input) return session.text('commands.timeout')
          else if (!regex.test(input)) return session.text('.timeError')

          const ruleArray = input.split('-')
          rule.day = ruleArray[0]
          rule.hour = ruleArray[1]
          if (ruleArray.length === 3) rule.minute = ruleArray[2]
        } else if (select === '2') {
          const regex = /\d{1,2}(-\d{1,2})?/
          await session.send(session.text('.interval.per-day', [offset]))
          const input = await session.prompt()
          if (!input) return session.text('commands.timeout')
          else if (!regex.test(input)) return session.text('.timeError')

          const ruleArray = input.split('-')
          rule.hour = ruleArray[0]
          if (ruleArray.length === 2) rule.minute = ruleArray[1]
        } else if (select === '3') {
          const regex = /\d{1,2}/
          await session.send(session.text('.interval.per-hour', [offset]))
          const input = await session.prompt()
          if (!input) return session.text('commands.timeout')
          else if (!regex.test(input)) return session.text('.timeError')

          const ruleArray = input.split('-')
          rule.minute = ruleArray[0]
        } else {
          return session.text('.interval.error')
        }

      } else {
        return session.text('.typeError')
      }

      rule.tz = 'Etc/UTC'

      const reminderCodeRes = await ctx.database.get('reminder', {}, ['reminder_code'])
      const existingCodes = reminderCodeRes.map((item) => item.reminder_code)
      const reminderCode = await generateUniqueCode(existingCodes)
      const reminder = {
        reminder_code: reminderCode,
        type: type,
        time: time? time : null,
        last_call: new Date(),
        recurrence_rule: rule,
        duration: duration? duration : null
      }
      console.log(reminder)
      ctx.emit('roll-bot/remind-add', session, reminder)
      return session.text('.success', [reminderCode])
    })
}
