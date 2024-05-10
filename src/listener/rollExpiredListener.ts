import {Context} from 'koishi';
import {Config} from '../config';

export function rollExpiredListener(ctx: Context, config: Config) {
  ctx.on('roll-bot/roll-expired', (roll) => {
    // Delete roll from database
    ctx.database.remove('')
    // Delete img

    // remove join key listener
    ctx.emit('roll-bot/roll-key-update')
    // remove remind
  })
}
