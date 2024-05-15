import { Context } from 'koishi';
import { Config } from '../../config';

export function deleteReminder(ctx: Context, config: Config) {
  ctx.command("remind.delete")
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {

    })
}
