import { Context, Logger } from 'koishi'
import { Config } from "./config";
import {} from 'koishi-plugin-assets-local'
import * as Database from './database'
import * as Command from './command'
import * as Listener from './listener'
import RemindManager from './util/remindManager'
import AutoEndManager from "./util/autoEndManager";
import ExpireManager from "./util/expireManager";

export const name = 'roll-bot'

export const inject = ['database', 'assets']

export * from './config'

export const logger = new Logger('Roll Bot')
export const remindManager = new RemindManager()
export const autoEndManager = new AutoEndManager()
export const expireManager = new ExpireManager()
export let rollKeyCache = {
  content: []
}
export let bots
export let globalState = {
  remindInitialId: 10000,
}
export const schedule = require('node-schedule')

export async function apply(ctx: Context, config: Config) {
  // localization
  ['de-DE', 'en-US', 'zh-CN']
    .forEach(lang => ctx.i18n.define(lang, require(`./locales/${lang}`)))
  // initialization
  ctx.on('ready', () => {
    bots = ctx.bots
  })
  ctx.on('login-updated', () => {
    bots = ctx.bots
  })
  ctx.plugin(Database)
  ctx.plugin(Listener, config)
  ctx.plugin(Command, config)
}
