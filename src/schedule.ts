import { Context } from "koishi"
import { Config } from "./config";
import { DateTime } from 'luxon';
export const name = 'Schedule'

export function apply(ctx: Context, config: Config) {
  // 定义任务执行时间和时区
  const timeZone = 'Asia/Shanghai';
  const localTime = DateTime.now().setZone(timeZone).plus({seconds: 5}).toISO();

  // 调度任务
  /*const job = schedule.scheduleJob(localTime, function() {
    console.log(`任务在 ${timeZone} 时区执行。当前时间：${DateTime.now().setZone(timeZone).toISO()}`);
  });*/

}
