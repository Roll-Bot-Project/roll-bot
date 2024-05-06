import {Context} from 'koishi';
import {Config} from '../config';
import {rollKeyCache} from "../index";

export function rollJoinListener(ctx: Context, config: Config) {
  ctx.on('message', async (session) => {
    const content = session.content
    const channelId = session.channelId
    for (const roll of rollKeyCache.content) {
      if (content === roll.joinKey && !roll.isEnd) {
        const res = await ctx.database.get('roll_channel', {channel_id: channelId, channel_platform: session.event.platform})
        for (const rollChannel of res) {
          if (rollChannel.roll_id === roll.id.toString()) {
            const bind = await ctx.database.get('binding', {platform: session.platform, pid: session.userId})
            ctx.emit('roll-bot/roll-join', session, bind[0].aid, roll.id, roll.roll_code)
          }

        }
      }
    }
  })
  ctx.on('roll-bot/roll-join', async (
    session,
    user_id,
    roll_id,
    roll_code
  ) => {
    const res = await ctx.database.get('roll_member', {roll_id: roll_id, user_id: user_id})
    if (res.length === 0) {
      await ctx.database.create('roll_member', {roll_id: roll_id, user_id: user_id})
      session.sendQueued(session.text('events.roll.add.success', {messageId: session.messageId, rollCode: roll_code}))
    }
    else {
      session.sendQueued(session.text('events.roll.add.failed', {messageId: session.messageId, rollCode: roll_code}))
    }
  })
}
