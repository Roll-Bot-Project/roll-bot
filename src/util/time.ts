import {Context} from 'koishi';
import {Config} from '../config';

export function validateTimeOffsetFormat(input: string): boolean {
  // offset from -12:00 to +14:00, minutes and seconds are optional
  const regex = /^[+-](0?[0-9])(?::([0-5]?[0-9])(?::([0-5]?[0-9]))?)?$/;
  return regex.test(input);
}

export function getTimeOffset(input: string) {
  // offset from -12:00 to +14:00, minutes and seconds are optional
  const regex = /[+-](0?[0-9])(?::([0-5]?[0-9])(?::([0-5]?[0-9]))?)?/
  const res = input.match(regex)
  return res? res[0] : ""
}

export async function getCurrentUTCOffset(ctx: Context, session: any, config: Config) {
  const preferUser = ctx.root.options.i18n.output === 'prefer-user'
  const resUser = await ctx.database.get('user', {id: session.user.id})
  const resChannel = await ctx.database.get('channel', {id: session.channelId, platform: session.platform})

  let currentChannelOffset = resChannel[0].offset === ''? '' : offsetToUTCOffset(resChannel[0].offset)
  let currentUserOffset = resUser[0].offset === ''? '' : offsetToUTCOffset(resUser[0].offset)
  let currentDefaultOffset = offsetToUTCOffset(config.basic.defaultTimeOffset)
  if (preferUser) {
    if (currentUserOffset != '') {
      return currentUserOffset
    } else if (currentUserOffset === '' && currentChannelOffset != '') {
      return currentChannelOffset
    } else {
      return currentDefaultOffset
    }
  } else {
    if (currentChannelOffset != '') {
      return currentChannelOffset
    } else if (currentChannelOffset === '' && currentUserOffset != '') {
      return currentUserOffset
    } else {
      return currentDefaultOffset
    }
  }
}

export function offsetToUTCOffset(offset: string): string {
  return 'UTC' + offset
}
