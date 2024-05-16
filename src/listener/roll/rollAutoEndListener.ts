import {Context, $} from 'koishi'
import {Config} from '../../config'
import {autoEndManager, globalState} from "../../index"
import {DateTime} from "luxon"

export function rollAutoEndListener(ctx: Context, config: Config) {
  // init
  ctx.on('ready', async () => {
    const rollRes = await ctx.database.get('roll', {isEnd: 0})
    for (const roll of rollRes) {
      if (roll.endTime) {
        if (DateTime.fromJSDate(roll.endTime) < DateTime.now()) {
          // if endTime is already passed, end the roll immediately
          autoEndManager.addJob(globalState.rollAutoEndInitialId, DateTime.now().plus({seconds: 3}).toJSDate(), function () {
            ctx.emit('roll-bot/roll-end', roll.id)
          })
        } else {
          autoEndManager.addJob(globalState.rollAutoEndInitialId, roll.endTime, function () {
            ctx.emit('roll-bot/roll-end', roll.id)
          })
        }
      }
    }
  })
}
