import {Context} from 'koishi';
import {Config} from '../../config';
import {hasPermission, isGuildAdmin, isPluginAdmin, isRollCreator} from "../../util/role";

export function deleteRoll(ctx: Context, config: Config) {
  ctx.command("roll.delete <rollCode>")
    .alias('删除抽奖')
    .action(async ({session}, rollCode) => {
      // check arg
      if (!rollCode) return session.text('.empty')
      const rollRes = await ctx.database.get('roll', {roll_code: rollCode})
      if (rollRes.length === 0) return session.text('.notFound')
      // auth
      const rollCreatorRes = await ctx.database.get('roll_creator', {roll_id: rollRes[0].id})
      if (config.permission.allowGuildAdminDelete) {
        if (!hasPermission(
          isPluginAdmin(session, config),
          await isRollCreator(session, rollCreatorRes[0].user_id),
          isGuildAdmin(session)
        )) return session.text('.noAuth')
      } else {
        if (!hasPermission(
          isPluginAdmin(session, config),
          await isRollCreator(session, rollCreatorRes[0].user_id),
        )) return session.text('.noAuth')
      }

      ctx.emit('roll-bot/roll-expired', rollRes[0].id)
      return session.text('.success', [rollCode])
    })
}
