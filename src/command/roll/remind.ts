import {Context} from 'koishi';
import {Config} from '../../config';
import {remindManager} from "../../index";
import {rollRemindMsgFromRollId} from "../../util/messageBuilder";

export function remindRoll(ctx: Context, config: Config) {
  ctx.command("roll.remind <rollCode>")
    .alias('抽奖提醒')
    .action(async ({session}, rollCode) => {
      const rollRes = await ctx.database.get('roll', {roll_code: rollCode})
      return await rollRemindMsgFromRollId(session, config, rollRes[0].id)
    })
}
