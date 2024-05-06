import {Context} from 'koishi';
import {Config} from '../config';

export function rollExpiredListener(ctx: Context, config: Config) {
  ctx.on('roll-bot/roll-expired', (roll) => {
    // Delete from database

  })
}
