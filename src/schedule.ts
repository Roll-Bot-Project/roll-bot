import { Context } from "koishi"
import { Config } from "./config";
import { DateTime } from 'luxon';

export const name = 'Schedule'

export function apply(ctx: Context, config: Config) {
  const schedule = require('node-schedule');

  const timeZone1 = 'Asia/Shanghai';
  const localTime1 = DateTime.now().setZone(timeZone1).plus({seconds: 2}).toISO();
  const job1 = schedule.scheduleJob(localTime1, function() {
    console.log(`任务在 ${timeZone1} 时区执行。当前时间：${DateTime.now().setZone(timeZone1).toISO()}`);
  })

  const timeZone2 = 'UTC';
  const localTime2 = DateTime.now().setZone(timeZone2).plus({seconds: 5}).toISO();
  const job2 = schedule.scheduleJob(localTime2, function() {
    console.log(`任务在 ${timeZone2} 时区执行。当前时间：${DateTime.now().setZone(timeZone2).toISO()}`);
  })

}
