import {Context} from 'koishi';
import {Config} from '../../config';
import {hasPermission, isGuildAdmin, isPluginAdmin} from "../../util/role";

export function deleteRoll(ctx: Context, config: Config) {
  ctx.command("roll.delete <rollCode>")
    .alias('删除抽奖')
    .action(async ({session}, rollCode) => {
      if (rollCode === undefined) return session.text('.empty')
      ctx.database.get('roll', {roll_code: rollCode})
        .then((res) => {

        })
        .catch()
      if (!hasPermission(
        config.permission.allowNormalUserAdd,
        isPluginAdmin(session, config),
        isGuildAdmin(session)
      )) return session.text('.noAuth')
    })
}
