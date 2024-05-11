import { Context } from "koishi"

declare module 'koishi' {
  interface Tables {
    roll: Roll,
    prize: Prize,
    remind: Remind,
    reminder: Reminder,
    roll_creator: RollCreator,
    roll_member: RollMember,
    roll_channel: RollChannel,
    roll_prize: RollPrize,
    remind_channel: RemindChennel
    user_prize: UserPrize
    user_reminder: UserReminder
  }
  interface User {
    offset: string
  }
  interface Channel {
    offset: string
  }
}

export interface Roll {
  id: number
  roll_code: string
  platform: string
  joinKey: string
  isAutoEnd: number
  rollType: string
  endTime: Date
  isEnd: number
  title: string
  description: string
}

export interface Prize {
  id: number
  name: string
  amount: number
}

export interface Remind {
  id: number
  roll_id: number
  reminder_id: number
}

export interface Reminder {
  id: number
  reminder_code: string
  type: string
  time: Date
  last_call: Date
  duration: object
  recurrence_rule: object
}

export interface RollCreator {
  id: number
  roll_id: number
  user_id: number
}

export interface RollMember {
  id: number
  roll_id: number
  user_id: number
}

export interface RollChannel {
  id: number
  roll_id: number
  channel_id: string
  channel_platform: string
}

export interface RollPrize {
  id: number
  roll_id: number
  prize_id: number
}

export interface RemindChennel {
  id: number
  remind_id: number
  channel_id: string
  channel_platform: string
}

export interface UserPrize {
  id: number
  user_id: number
  prize_id: number
  amount: number
}

export interface UserReminder {
  id: number
  user_id: number
  reminder_id: number
}

export const name = 'Database'

export function apply(ctx: Context) {
  ctx.model.extend('user', {
    offset: 'string',
  })

  ctx.model.extend('channel', {
    offset: 'string',
  })

  ctx.model.extend('roll', {
    id: 'unsigned',
    roll_code: 'string',
    platform: 'string',
    joinKey: 'string',
    isAutoEnd: 'integer',
    rollType: 'string',
    endTime: 'timestamp',
    isEnd: 'integer',
    title: 'string',
    description: 'string'
  }, {
    autoInc: true,
  })

  ctx.model.extend('prize', {
    id: 'unsigned',
    name: 'string',
    amount: 'unsigned'
  }, {
    autoInc: true,
  })

  ctx.model.extend('remind', {
    id: 'unsigned',
    roll_id: 'unsigned',
    reminder_id: 'unsigned'
  }, {
    autoInc: true,
  })

  ctx.model.extend('reminder', {
    id: 'unsigned',
    reminder_code: 'string',
    type: 'string',
    time: 'timestamp',
    lastCall: 'timestamp',
    recurrence_rule: 'json',
    duration: 'json'
  }, {
    autoInc: true,
  })

  ctx.model.extend('roll_creator', {
    id: 'unsigned',
    roll_id: 'unsigned',
    user_id: 'unsigned'
  }, {
    autoInc: true,
  })

  ctx.model.extend('roll_member', {
    id: 'unsigned',
    roll_id: 'unsigned',
    user_id: 'unsigned'
  }, {
    autoInc: true,
  })

  ctx.model.extend('roll_channel', {
    id: 'unsigned',
    roll_id: 'unsigned',
    channel_id: 'string',
    channel_platform: 'string'
  }, {
    autoInc: true,
  })

  ctx.model.extend('roll_prize', {
    id: 'unsigned',
    roll_id: 'unsigned',
    prize_id: 'unsigned'
  }, {
    autoInc: true,
  })

  ctx.model.extend('remind_channel', {
    id: 'unsigned',
    remind_id: 'unsigned',
    channel_id: 'string',
    channel_platform: 'string'
  }, {
    autoInc: true,
  })

  ctx.model.extend('user_prize', {
    id: 'unsigned',
    user_id: 'unsigned',
    prize_id: 'unsigned',
    amount: 'unsigned'
  }, {
    autoInc: true,
  })

  ctx.model.extend('user_reminder', {
    id: 'unsigned',
    user_id: 'unsigned',
    reminder_id: 'unsigned'
  }, {
    autoInc: true,
  })
}
