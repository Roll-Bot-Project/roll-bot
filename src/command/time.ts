import {Context} from 'koishi';
import {Config} from '../config';
import {hasPermission, isGuildAdmin, isPluginAdmin} from '../util/role'
import { validateTimeFormat, offsetToUTCOffset } from '../util/time'

export function time(ctx: Context, config: Config) {
  ctx.command("roll.time [offset]")
    .alias('时区')
    .option('channel', '-c')
    .userFields(['offset'])
    .channelFields(['offset'])
    .action(async ({session, options}, offset) => {
      // if offset is empty, return current offset
      if (!offset) {
        const preferUser = ctx.root.options.i18n.output === 'prefer-user'
        let currentChannelOffset = session.channel.offset.length === 0 ? session.text('.empty') : offsetToUTCOffset(session.channel.offset)
        let currentUserOffset = session.user.offset.length === 0 ? session.text('.empty') : offsetToUTCOffset(session.user.offset)
        let currentDefaultOffset = offsetToUTCOffset(config.basic.defaultTimeOffset)
        if (preferUser) {
          if (currentUserOffset != session.text('.empty')) {
            currentUserOffset += ' < ' + session.text('.selected')
          } else if (currentUserOffset === session.text('.empty') && currentChannelOffset != session.text('.empty')) {
            currentChannelOffset += ' < ' + session.text('.selected')
          } else {
            currentDefaultOffset += ' < ' + session.text('.selected')
          }
        } else {
          if (currentChannelOffset != session.text('.empty')) {
            currentChannelOffset += ' < ' + session.text('.selected')
          } else if (currentChannelOffset === session.text('.empty') && currentUserOffset != session.text('.empty')) {
            currentUserOffset += ' < ' + session.text('.selected')
          } else {
            currentDefaultOffset += ' < ' + session.text('.selected')
          }
        }
        return session.text('.result', [currentChannelOffset, currentUserOffset, currentDefaultOffset])
      }

      if (!validateTimeFormat(offset)) return session.text('.inValidFormat')

      if (options.channel) {
        if (!hasPermission(isPluginAdmin(session, config), isGuildAdmin(session))) return session.text('.noAuth')
        session.channel.offset = offset
        return session.text('.success.channel', [offset])
      } else {
        session.user.offset = offset
        return session.text('.success.user', [offset])
      }
    })
}
