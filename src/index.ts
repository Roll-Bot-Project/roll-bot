import { Context, Logger } from 'koishi'
import { Config } from "./config";
import * as Database from './database'
import * as Command from './command'
import * as Listener from './listener'
import * as Scheduler from './schedule'

export const name = 'roll-bot'

export const inject = ['database', 'assets']

export * from './config'

export const logger = new Logger('Roll Bot')
export let rollKeyCache = {
  content: []
}
export let bots
export const schedule = require('node-schedule')

export async function apply(ctx: Context, config: Config) {
  // localization
  ctx.i18n.define('de-DE', require('./locales/de-DE'))
  ctx.i18n.define('en-US', require('./locales/en-US'))
  ctx.i18n.define('zh-CN', require('./locales/zh-CN'))
  // initialization
  ctx.on('ready', () => {
    bots = ctx.bots
  })
  ctx.on('login-updated', () => {
    bots = ctx.bots
  })
  ctx.plugin(Database)
  ctx.plugin(Listener, config)
  ctx.plugin(Scheduler, config)
  ctx.plugin(Command, config)
}


