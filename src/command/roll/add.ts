import { Context } from 'koishi';
import { Config } from '../../config';
import { DateTime } from 'luxon';
import { stringToPrize, generateUniqueCode } from "../../util/general";
import {hasPermission, isGuildAdmin, isPluginAdmin} from "../../util/role";
import {getCurrentUTCOffset} from "../../util/time";

export function addRoll(ctx: Context, config: Config) {
  ctx.command("roll.add")
    .alias('创建抽奖')
    .option('n', '-n')
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session, options}) => {
      // auth
      if (!hasPermission(
        config.permission.allowNormalUserAdd,
        isPluginAdmin(session, config),
        isGuildAdmin(session)
      )) return session.text('.noAuth')

      // time offset
      const offset = getCurrentUTCOffset(ctx, session, config)

      if (options.n) {
        // Fast add
        await session.send(session.text('.prize'))
        const prize = await session.prompt()
        if (!prize) return session.text('commands.timeout')
        const prizeList = prize.split(/\r\n|\r|\n/).map(s => {
          return stringToPrize(s)
        })
        const rollCodeRes = await ctx.database.get('roll', {}, ['roll_code'])
        const existingCodes = rollCodeRes.map((item) => item.roll_code)
        const rollCode = await generateUniqueCode(existingCodes)

        const platform = session.event.platform

        const roll = {
          roll_code: rollCode,
          platform: platform,
          joinKey: '',
          isAutoEnd: false,
          rollType: 1,
          endTime: '',
          isEnd: false,
          title: session.text('.defaultTitle', [session.author.name]),
          description: session.text('.defaultDescription', [session.author.name]),
        }

        // emit roll add event
        ctx.emit('roll-bot/roll-add',
          session,
          roll,
          prizeList,
          {}
        )
        ctx.emit('roll-bot/roll-key-update')
        return session.text(`.success`, [roll.roll_code])
      } else {
        // Normal add
        await session.send(session.text('.title', [session.author.name]))
        const title = await session.prompt()
        if (!title) return session.text('commands.timeout')

        await session.send(session.text('.description', [session.author.name]))
        const description = await session.prompt()
        if (!description) return session.text('commands.timeout')

        await session.send(session.text('.prize'))
        const prize = await session.prompt()
        if (!prize) return session.text('commands.timeout')

        let endTime
        await session.send(session.text('.autoEnd', [await offset]))
        let endTimeInput = await session.prompt()
        if (!endTimeInput) return session.text('commands.timeout')
        if (endTimeInput === 'n') endTime = ''
        else if (!isValidDateInput(endTimeInput)) return session.text('.timeError')
        else {
          try {
            endTime = await dateInputToDateTime(endTimeInput, await offset).toUTC()
          } catch (e) {
            return session.text('.timeError')
          }
        }

        let isAutoEnd = false
        let rollType = '1'
        if (endTime != '') {
          isAutoEnd = true
          await session.send(session.text('.type'))
          let RollTypeInput = await session.prompt()
          if (!RollTypeInput) return session.text('commands.timeout')
          if (RollTypeInput === 'n') RollTypeInput = '1'
          if (RollTypeInput != '0' && RollTypeInput != '1') return session.text('.typeError')
          rollType = RollTypeInput
        }

        await session.send(session.text('.joinKey'))
        let joinKey = await session.prompt()
        if (!joinKey) return session.text('commands.timeout')
        if (joinKey === 'n') joinKey = ''

        const roll_code_res = await ctx.database.get('roll', {}, ['roll_code'])
        const existingCodes = roll_code_res.map((item) => item.roll_code)
        const roll_code = await generateUniqueCode(existingCodes)
        const platform = session.event.platform

        const roll = {
          roll_code: roll_code,
          platform: platform,
          joinKey: joinKey,
          isAutoEnd: isAutoEnd,
          rollType: rollType,
          endTime: endTime,
          isEnd: false,
          title: title != 'n'? await ctx.assets.transform(title) : session.text('.defaultTitle', [session.author.name]),
          description: description != 'n'? await ctx.assets.transform(description) : session.text('.defaultDescription', [session.author.name]),
        }

        const prizeList = prize.split(/\r\n|\r|\n/).map(s => {
          return stringToPrize(s)
        })

        ctx.emit('roll-bot/roll-add',
          session,
          roll,
          prizeList,
          {}
        )
        ctx.emit('roll-bot/roll-key-update')

        return session.text(`.success`, [roll.roll_code])
      }
    })
}

function isValidDateInput(input: string): boolean {
  const regex = /\d{4}-\d{1,2}-\d{1,2}-\d{1,2}(-\d{1,2})?/
  return regex.test(input)
}

function dateInputToDateTime(input: string, offset: string): DateTime {
  // year - month - day - hour - minutes
  const timeArray = input.split('-')
  let t
  if (timeArray.length === 4) {
    t = {year: timeArray[0], month: timeArray[1],day: timeArray[2], hour: timeArray[3]}
  } else {
    t = {year: timeArray[0], month: timeArray[1],day: timeArray[2], hour: timeArray[3], minute: timeArray[4]}
  }
  return DateTime.fromObject(t, { zone: offset })
}
