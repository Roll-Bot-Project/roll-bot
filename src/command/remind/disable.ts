import { Context } from 'koishi';
import { Config } from '../../config';

export function disableRemind(ctx: Context, config: Config) {
  ctx.command("remind.disable")
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {

    })
}
