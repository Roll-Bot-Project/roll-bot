import {Context} from 'koishi';
import {Config} from '../../config';

export function help(ctx: Context, config: Config) {
  ctx.command("roll.help")
    .alias('抽奖帮助')
    .alias('roll.h')
    .action(({session}) => {
      return session.text('.help')
    })
}
