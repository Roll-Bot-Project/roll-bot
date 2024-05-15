import {Context, $} from 'koishi'
import {Config} from '../../config'
import {remindManager} from "../../index";
import schedule from 'node-schedule'

export function remindDeleteListener(ctx: Context, config: Config) {
  ctx.on('dispose', () => {
    schedule.gracefulShutdown()
  })

  ctx.on('roll-bot/remind-delete', (remindId) => {
    remindManager.deleteJob(remindId)
  })
}
