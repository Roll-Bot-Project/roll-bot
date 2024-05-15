import { Context } from "koishi"
import { Config } from "./config";

import {rollAddListener} from "./listener/roll/rollAddListener"
import {rollEndListener} from "./listener/roll/rollEndListener"
import {rollAutoEndListener} from "./listener/roll/rollAutoEndListener"
import {rollExpiredListener} from "./listener/roll/rollExpiredListener"
import {keyCacheListener} from "./listener/roll/keyCacheListener"
import {rollJoinListener} from "./listener/roll/rollJoinListener"
import {rollQuitListener} from "./listener/roll/rollQuitListener"

import {reminderAddListener} from "./listener/reminder/reminderAddListener"
import {reminderDeleteListener} from "./listener/reminder/reminderDeleteListener"

import {remindAddListener} from "./listener/remind/remindAddListener"
import {remindDeleteListener} from "./listener/remind/remindDeleteListener"
import {remindBroadcastListener} from "./listener/remind/remindBroadcastListener"


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
    'roll-bot/remind-add'(...args: any[]): void
    'roll-bot/remind-delete'(...args: any[]): void
    'roll-bot/remind-broadcast'(...args: any[]): void
  }
}

export function apply(ctx: Context, config: Config) {
  keyCacheListener(ctx, config)
  rollAddListener(ctx, config)
  rollEndListener(ctx, config)
  rollAutoEndListener(ctx, config)
  rollExpiredListener(ctx, config)
  rollJoinListener(ctx, config)
  rollQuitListener(ctx, config)
  reminderAddListener(ctx, config)
  reminderDeleteListener(ctx, config)
  remindAddListener(ctx, config)
  remindDeleteListener(ctx, config)
  remindBroadcastListener(ctx, config)
}
