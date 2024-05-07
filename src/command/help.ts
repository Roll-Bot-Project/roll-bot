import {Context} from 'koishi';
import {Config} from '../config';

export function help(ctx: Context, config: Config) {
  ctx.command("roll.help")
    .alias('抽奖帮助')
    .action(({session}) => {
      return `[7715] <img url="http://10.0.0.80:5140/files/955d3e8397a794224dbf28e889aae1b7528275ad-F324E22E8BBC62C0FA1AD8ACF3F2348E.jpg"/> ac@LogTools aa的a`
      return session.text('.help')
    })
}
