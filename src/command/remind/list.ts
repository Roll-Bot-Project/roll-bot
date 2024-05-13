import { Context } from 'koishi';
import { Config } from '../../config';

export function listRemind(ctx: Context, config: Config) {
  ctx.command("remind.list")
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session}) => {
      const res = await ctx.database.get('reminder', {})
      console.log(res)
    })
}
