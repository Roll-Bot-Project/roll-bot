import {Context} from 'koishi';
import {Config} from '../../config';
import {remindManager} from "../../index";

export function remindRoll(ctx: Context, config: Config) {
  ctx.command("roll.remind <rollCode>")
    .alias('a')
    .action(async ({session}, rollCode) => {
      console.log(remindManager.getAllJobs())
    })
}
