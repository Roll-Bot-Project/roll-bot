import {Context, $} from 'koishi';
import {DateTime} from 'luxon'
import {Config} from '../config';
import {getWinnerList} from "../util/winnerGenerator";
import {rollEndMsgFromRollId} from "../util/messageBuilder";
import {bots} from "../index";

export function rollEndListener(ctx: Context, config: Config) {
  ctx.on('roll-bot/roll-end', async (rollId) => {
    const res = await ctx.database.get('roll', {id: rollId})
    const roll = res[0]
    if (roll.isEnd) return
    // Generate winner
    const winnerList = await getWinnerList(ctx, rollId)
    // Write to user_prize
    for (const winnerPrize of winnerList) {
      const r = await ctx.database.get('user_prize', {user_id: winnerPrize.userId, prize_id: winnerPrize.prizeId})
      if (r.length === 0) {
        await ctx.database.create('user_prize', {user_id: winnerPrize.userId, prize_id: winnerPrize.prizeId, amount: 1})
      } else {
        await ctx.database.set('user_prize', {user_id: winnerPrize.userId, prize_id: winnerPrize.prizeId}, (row) => ({amount: $.add(row.amount, 1),}))
      }
    }
    // Change roll status
    await ctx.database.set('roll', roll.id, {
      isEnd: 1,
      endTime: DateTime.now().toUTC().toJSDate()
    })
    // Broadcast roll end message
    // TODO: Support diverse messages such as countdowns, result pictures, etc
    const rollOpenRange = await ctx.database.get('roll_channel', {roll_id: roll.id})
    // support i18n
    for (const item of rollOpenRange) {
      for (const bot of bots) {
        if (bot.platform === item.channel_platform) {
          const msg = await rollEndMsgFromRollId(ctx, config, roll, item)
          bot.sendMessage(item.channel_id, msg)
        }
      }
    }
    // remove join key listener
    ctx.emit('roll-bot/roll-key-update')
  })
}
