import { Context } from 'koishi';
import { Config } from '../../config';
import { DateTime } from 'luxon';
import {schedule} from "../../index";
import {getCurrentUTCOffset} from "../../util/time";
import {generateUniqueCode} from "../../util/general";

export function addRoll(ctx: Context, config: Config) {
  ctx.command("remind.add")
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {
      const offset = getCurrentUTCOffset(ctx, session, config)
      const rule = new schedule.RecurrenceRule()
      let time, duration
      await session.send(session.text('.type'))
      const type = await session.prompt()
      if (!type) return session.text('commands.timeout')

      if (type === '0') {
        // specified
        const regex = /\d{4}-\d{1,2}-\d{1,2}-\d{1,2}(-\d{1,2})?/
        await session.send(session.text('.specified', [await offset]))
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
        const regex = /\d{4}-\d{1,2}-\d{1,2}-\d{1,2}(-\d{1,2})?/
        await session.send(session.text('.specified', [await offset]))
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
        


      } else {
        return session.text('.typeError')
      }

      rule.tz = 'Etc/UTC';

      const reminderCodeRes = await ctx.database.get('reminder', {}, ['reminder_code'])
      const existingCodes = reminderCodeRes.map((item) => item.reminder_code)
      const reminderCode = await generateUniqueCode(existingCodes)
      const reminder = {
        reminder_code: reminderCode,
        time: time,
        last_call: new Date(),
        recurrence_rule: rule,
        duration: duration
      }
      ctx.emit('roll-bot/remind-add', session, reminder)
    })
}
