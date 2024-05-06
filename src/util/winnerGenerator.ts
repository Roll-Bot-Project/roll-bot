import { Context, $, Random } from 'koishi'

export async function getWinnerList(ctx: Context, rollId: number) {
  const memberList = []
  const prizeList = []

  const resMember = await ctx.database.get('roll_member', {roll_id: rollId})
  resMember.forEach(m => {
    memberList.push(m.user_id)
  })
  if (memberList.length === 0) return []

  const resPrizes = await ctx.database.get('roll_prize', {roll_id: rollId})
  for (const p of resPrizes) {
    const resPrize = await ctx.database.get('prize', {id: p.prize_id})
    for (let i = 0; i < resPrize[0].amount; i++) {
      prizeList.push(resPrize[0].id);
    }
  }
  const res = await ctx.database.get('roll', {id: rollId})
  const roll = res[0]
  // Draws with repeatable winners
  if (roll.rollType === '0') {
    return repeatableWinners(memberList, prizeList)
  }
  // Draw with unique winners
  else if (roll.rollType === '1') {
    return uniqueWinners(memberList, prizeList)
  }
}

export function uniqueWinners(memberList: string[], prizeList: string[]) {
  if (memberList.length === 0 || prizeList.length === 0) return []
  const length = prizeList.length
  const shuffledMembers = Random.shuffle(memberList)
  const shuffledPrizes = Random.shuffle(prizeList)
  const winners = [];

  let i = 0
  while (i < length) {
    for (const member of shuffledMembers) {
      if (i === length) break
      winners.push({userId: member, prizeId: shuffledPrizes[i]});
      i++
    }
  }
  return winners;
}

export function repeatableWinners(memberList: string[], prizeList: string[]) {
  if (memberList.length === 0 || prizeList.length === 0) return []
  const winners = [];

  for (let i = 0; i < prizeList.length; i++) {
    winners.push({ userId: Random.pick(memberList), prizeId: prizeList[i] });
  }
  return winners
}

