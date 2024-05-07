import {Context, $, Session, h} from 'koishi'
import { Config } from "../config";
import {DateTime} from 'luxon';
import {bots} from '../index'

export async function rollListMsgFromChannelId(session: Session, cid: string, platform: string) {
  let msg = session.text('messageBuilder.roll.list.header')
  let endList = '<p>' + session.text('messageBuilder.marks.end') + '</p>'
  let notEndList = '<p>' + session.text('messageBuilder.marks.open') + '</p>'
  let isEndListEmpty = true
  let isNotEndListEmpty = true

  const r = await session.app.database.get('roll_channel', {channel_id: cid, channel_platform: platform}, ['roll_id'])
  if (r.length === 0) return session.text('messageBuilder.roll.list.error')
  const res = r.map((item) => item.roll_id)

  let listItem
  for (const rollId of res) {
    let listItemRes = await session.app.database.get('roll', {id: rollId}, ['roll_code', 'isEnd', 'title'])
    if (listItemRes.length === 1) {
      listItem = listItemRes[0]
      if (listItem.isEnd) {
        endList += session.text('messageBuilder.roll.list.listItem', listItem)
        isEndListEmpty = false
      } else {
        notEndList += session.text('messageBuilder.roll.list.listItem', listItem)
        isNotEndListEmpty = false
      }
    }
  }
  if (!isNotEndListEmpty) msg += notEndList
  if (!isEndListEmpty) msg += endList
  return h.unescape(msg)
}

export async function rollDetailMsgFromRoll(session: Session, roll: any, currentOffset: string, currentLocale: string) {
  const dt = DateTime.fromObject(roll.endTime, { zone: 'UTC' }).setZone(currentOffset)
  let msgList = []
  let msg = ""
  msgList.push(session.text('messageBuilder.roll.detail.header', {
    mark: roll.isEnd ? session.text('messageBuilder.marks.end') : session.text('messageBuilder.marks.open'),
    roll_code: roll.roll_code,
    title: roll.title,
    description: roll.description,
    endTime: dt.setLocale(currentLocale).toLocaleString(DateTime.DATETIME_FULL)
  }))
  // prize list
  msgList.push(session.text('messageBuilder.roll.detail.divider'))
  msgList.push(session.text('messageBuilder.roll.detail.body.prizeTitle'))
  const res = await session.app.database.get('roll_prize', {roll_id: roll.id})
  for (const e of res) {
    const prize = await session.app.database.get('prize', {id: e.prize_id})
    msgList.push(session.text('messageBuilder.roll.detail.body.prizeListItem', {name: prize[0].name, amount: prize[0].amount}))
  }
  // if roll is end, show winner list
  if (roll.isEnd) {
    msgList.push(session.text('messageBuilder.roll.detail.divider'))
    msgList.push(session.text('messageBuilder.roll.detail.body.winnerTitle'))
    const res = await session.app.database.get('roll_member', {roll_id: roll.id}, ['user_id'])
    const r = await session.app.database.join(['roll_prize', 'user_prize'], (roll_prize, user_prize) => $.eq(roll_prize.prize_id, user_prize.prize_id)).execute()
    // for every member
    let isWinner = false
    for (let u of res) {
      const userId = u.user_id
      const userPlatformId = await session.app.database.get('binding', {aid: userId})
      let user = null
      for (const bot of bots) {
        if (bot.platform === userPlatformId[0].platform) {
          user = await bot.getUser(userPlatformId[0].pid)
        }
      }
      msgList.push(session.text('messageBuilder.roll.detail.body.winner', {userName: user.name, userId: userPlatformId[0].pid}))
      for (const e of r) {
        if (e.roll_prize.roll_id === roll.id && e.user_prize.user_id === userId) {
          isWinner = true
          const prizeDetail = await session.app.database.get('prize', {id: e.roll_prize.prize_id})
          msgList.push(session.text('messageBuilder.roll.detail.body.winList', {
            name: prizeDetail[0].name,
            amount: e.user_prize.amount
          }))
        }
      }
      if (!isWinner) {
        msgList.pop()
      }
      isWinner = false
    }
  }
  msgList.forEach((str) => msg += h.unescape(str))
  return msg
}

export async function rollMemberMsgFromRoll(session: Session, roll: any) {

  let res = await session.app.database.get('roll_member', {roll_id: roll.id})
  if (res.length === 0) return session.text('messageBuilder.roll.member.empty')

  let msg = session.text('messageBuilder.roll.member.header', [roll.roll_code])
  for (const member of res) {
    const userId = await session.app.database.get('binding', {aid: member.user_id})
    let user = null
    for (const bot of bots) {
      if (bot.platform === userId[0].platform) {
        user = await bot.getUser(userId[0].pid)
      }
    }
    msg += session.text('messageBuilder.roll.member.body.memberListItem', {userName: user.name, userId: userId[0].pid})
  }

  return msg
}

export async function rollEndMsgFromRollId(ctx: Context, config: Config, roll: any, channel: any) {
  // i18n
  //ctx.i18n.render(locales: string[], path: string[], params: any)
  let locales
  const platform = channel.channel_platform
  const channelId = channel.channel_id
  const currentChannel = await ctx.database.get('channel', {id: channelId, platform: platform})
  if (currentChannel[0].locales.length === 0) {
    locales = ctx.root.options.i18n.locales
  } else {
    locales = currentChannel[0].locales
  }
  let msgList = []
  let msg = ""
  msgList[0] = ctx.i18n.render(locales, ['messageBuilder.roll.end.header'], [roll.roll_code])
  const res = await ctx.database.get('roll_member', {roll_id: roll.id}, ['user_id'])
  const r = await ctx.database.join(['roll_prize', 'user_prize'], (roll_prize, user_prize) => $.eq(roll_prize.prize_id, user_prize.prize_id)).execute()
  // for every member
  let isWinner = false
  for (let u of res) {
    const userId = u.user_id
    const userPlatformId = await ctx.database.get('binding', {aid: userId})
    let user = null
    for (const bot of bots) {
      if (bot.platform === userPlatformId[0].platform) {
        user = await bot.getUser(userPlatformId[0].pid)
      }
    }
    msgList.push(ctx.i18n.render(locales, ['messageBuilder.roll.end.body.winner'], {userName: user.name, userId: userPlatformId[0].pid})[0])
    for (const e of r) {
      if (e.roll_prize.roll_id === roll.id.toString() && e.user_prize.user_id === userId) {
        isWinner = true
        const prizeDetail = await ctx.database.get('prize', {id: e.roll_prize.prize_id})
        msgList.push(ctx.i18n.render(locales, ['messageBuilder.roll.end.body.winList'], {
          name: prizeDetail[0].name,
          amount: e.user_prize.amount
        })[0])
      }
    }
    if (!isWinner) {
      msgList.pop()
    }
    isWinner = false
  }
  msgList.forEach((str) => msg += str)
  return h.unescape(msg)
}
