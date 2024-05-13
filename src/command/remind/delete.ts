import { Context } from 'koishi';
import { Config } from '../../config';

export function deleteRemind(ctx: Context, config: Config) {
  ctx.command("remind.delete")
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {
      // only for test
      ctx.database.drop('reminder')
      ctx.database.drop('user_reminder')
      console.log('Reminder database dropped!')
      //
    })
}
