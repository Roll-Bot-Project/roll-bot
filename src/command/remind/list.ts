import { Context } from 'koishi';
import { Config } from '../../config';
import {reminderListMsgFromUserId} from "../../util/messageBuilder";

export function listReminder(ctx: Context, config: Config) {
  ctx.command("remind.list")
    .userFields(['id', 'offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {
      const userId = session.user.id
      return await reminderListMsgFromUserId(session, userId, config)
    })
}
