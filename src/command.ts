import { Context } from 'koishi'
import { Config } from "./config";

import {help} from './command/help'
import {addRoll} from './command/add'
import {deleteRoll} from './command/delete'
import {detailRoll} from './command/detail'
import {endRoll} from './command/end'
import {joinRoll} from './command/join'
import {quitRoll} from './command/quit'
import {listRoll} from './command/list'
import {memberRoll} from './command/member'

import {locale} from './command/locale'
import {time} from './command/time'

export const name = 'Command'

export function apply(ctx: Context, config: Config) {
  ctx.command('roll').alias('r')
  help(ctx, config)
  addRoll(ctx, config)
  deleteRoll(ctx, config)
  detailRoll(ctx, config)
  endRoll(ctx, config)
  joinRoll(ctx, config)
  quitRoll(ctx, config)
  listRoll(ctx, config)
  memberRoll(ctx, config)
  locale(ctx, config)
  time(ctx, config)
}
