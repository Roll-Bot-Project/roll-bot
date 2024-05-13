import { Context } from "koishi"
import { Config } from "./config";

import {rollAddListener} from "./listener/rollAddListener"
import {rollEndListener} from "./listener/rollEndListener"
import {rollExpiredListener} from "./listener/rollExpiredListener"
import {keyCacheListener} from "./listener/keyCacheListener"
import {rollJoinListener} from "./listener/rollJoinListener"
import {rollQuitListener} from "./listener/rollQuitListener"
import {reminderAddListener} from "./listener/reminderAddListener"
import {reminderDeleteListener} from "./listener/reminderDeleteListener"
import {remindListener} from "listener/remindListener"


export const name = 'Listener'

declare module 'koishi' {
  interface Events {
    'roll-bot/roll-key-update'(...args: any[]): void
    'roll-bot/roll-add'(...args: any[]): void
    'roll-bot/roll-end'(...args: any[]): void
    'roll-bot/roll-expired'(...args: any[]): void
    'roll-bot/roll-join'(...args: any[]): void
    'roll-bot/roll-quit'(...args: any[]): void
    'roll-bot/reminder-add'(...args: any[]): void
    'roll-bot/reminder-delete'(...args: any[]): void
    'roll-bot/remind-broadcast'(...args: any[]): void
  }
}

export function apply(ctx: Context, config: Config) {
  keyCacheListener(ctx, config)
  rollAddListener(ctx, config)
  rollEndListener(ctx, config)
  rollExpiredListener(ctx, config)
  rollJoinListener(ctx, config)
  rollQuitListener(ctx, config)
  reminderAddListener(ctx, config)
  reminderDeleteListener(ctx, config)
  //remindListener(ctx, config)
}
