import {Context} from 'koishi';
import {Config} from '../../config';

export function channel(ctx: Context, config: Config) {
  ctx.command("roll.channel")
    .alias('roll.ch')
    .action(({session}) => {
      return session.text('.result', [session.channelId])
    })
}
