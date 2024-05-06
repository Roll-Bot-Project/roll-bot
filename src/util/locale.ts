import {Context} from 'koishi';
import {Config} from "../config";

export function getCurrentLocales(ctx: Context, session: any, config: Config): string {
  const preferUser = ctx.root.options.i18n.output === 'prefer-user'
  let currentChannelLocales = session.channel.locales.length === 0 ? '' : session.channel.locales
  let currentUserLocales = session.user.locales.length === 0 ? '' : session.user.locales
  let currentDefaultLocales = ctx.root.options.i18n.locales

  if (preferUser) {
    if (currentUserLocales != '') {
      return currentUserLocales
    } else if (currentUserLocales === '' && currentChannelLocales != '') {
      return currentChannelLocales
    } else {
      return currentDefaultLocales
    }
  } else {
    if (currentChannelLocales != '') {
      return currentChannelLocales
    } else if (currentChannelLocales === '' && currentUserLocales != '') {
      return currentUserLocales
    } else {
      return currentDefaultLocales
    }
  }
}
