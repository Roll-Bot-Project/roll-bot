import { Context } from 'koishi'
import { Config } from "./config";

import {help} from './command/basic/help'
import {channel} from './command/basic/channel'

import {addRoll} from './command/roll/add'
import {deleteRoll} from './command/roll/delete'
import {detailRoll} from './command/roll/detail'
import {endRoll} from './command/roll/end'
import {joinRoll} from './command/roll/join'
import {quitRoll} from './command/roll/quit'
import {listRoll} from './command/roll/list'
import {memberRoll} from './command/roll/member'

import {locale} from './command/i18n/locale'
import {time} from './command/i18n/time'

export const name = 'Command'

export function apply(ctx: Context, config: Config) {
  ctx.command('roll').alias('r')
  help(ctx, config)
  addRoll(ctx, config)
  //deleteRoll(ctx, config)
  detailRoll(ctx, config)
  endRoll(ctx, config)
  joinRoll(ctx, config)
  quitRoll(ctx, config)
  listRoll(ctx, config)
  memberRoll(ctx, config)
  locale(ctx, config)
  time(ctx, config)
  channel(ctx, config)
  //remind(ctx, config)
  ctx.command('remind').alias('rd')
  //addRemind(ctx, config)
  //enableRemind(ctx, config)
  //disableRemind(ctx, config)
  //deleteRemind(ctx, config)
  //listRemind(ctx, config)
}
