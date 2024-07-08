import {} from 'koishi';
import { logger, Config } from '../index';

export * from '../config'

export function hasPermission(...perms: boolean[]): boolean {
  return perms.some(perm => perm === true)
}

export function isPluginAdmin(session: any, config: Config): boolean {
  return config.basic.adminUsers?.includes(session.userId) ?? false
}

export function isGuildAdmin(session: any): boolean {
  const platform = session.event.platform
  let guildMember

  // TODO: Check roles in qq channel
  if (platform === 'onebot') {
    guildMember = session.event.member.roles[0]
    return guildMember === 'owner' || guildMember === 'admin' || guildMember === 'SUBCHANNEL_ADMIN' || guildMember === 'OWNER' || guildMember === 'ADMIN'
  } else if (platform === 'qq') {
    // TODO: Support official qq bot

    return true
  } else {
    return true
  }
}

export async function isRollCreator(session: any, rollCreatorId: number): Promise<boolean> {
  return session.user.id === rollCreatorId
}
