import { DateTime, Duration } from 'luxon';
import {Config} from "../config";
import {offsetToUTCOffset} from "./time";

export function stringToPrize(s: string) {
  const lastIndex = s.lastIndexOf('*');
  if (lastIndex === -1) {
    return { name: s, amount: '1' };
  } else {
    let name = s.substring(0, lastIndex);
    let amount = s.substring(lastIndex + 1);
    if (isNaN(Number(amount)) || amount === '') {
      name += amount
      amount = '1'
    }
    return { name: name, amount: amount };
  }
}

export async function generateUniqueCode(existingCodes: string[]): Promise<string> {
  let newCode
  do {
    newCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  } while (existingCodes.includes(newCode))
  return newCode
}

export function checkDateInput(input: string, length: number): boolean {
  let regexPattern = ""
  // minute can be empty when the length greater than 1
  switch (length) {
    case 1:
      // minute
      regexPattern = "^\\d{1,2}$"
      break
    case 2:
      // Hour-minute
      regexPattern = "^\\d{1,2}(-\\d{1,2})?$"
      break
    case 3:
      // Day-hour-minute
      regexPattern = "^\\d{1,2}-\\d{1,2}(-\\d{1,2})?$"
      break
    case 4:
      // Month-day-hour-minute
      regexPattern = "^\\d{1,2}-\\d{1,2}-\\d{1,2}(-\\d{1,2})?$"
      break
    case 5:
      // Year-month-day-hour-minute
      regexPattern = "^\\d{1,4}-\\d{1,2}-\\d{1,2}-\\d{1,2}(-\\d{1,2})?$"
      break
    default:
      return false
  }

  const regex = new RegExp(regexPattern);

  return regex.test(input);
}

export function dateInputToDateTime(input: string, offset: string): DateTime {
  const timeArray = input.split('-')
  const t = {
    year: timeArray[0],
    month: timeArray[1],
    day: timeArray[2],
    hour: timeArray[3],
    minute: timeArray[4] || undefined
  }
  return DateTime.fromObject(t, { zone: offset })
}

export function dateInputToDuration(input: string): Duration {
  const timeArray = input.split('-')
  const t = {
    years: timeArray[0],
    months: timeArray[1],
    days: timeArray[2],
    hours: timeArray[3],
    minutes: timeArray[4] || undefined
  }
  return Duration.fromObject(t)
}

export function getRemindValueFromReminder(endTime: Date, reminder: any) {
  switch (reminder.type) {
    case '0':
      return reminder.time
    case '1':
      return DateTime.fromJSDate(endTime).minus(reminder.duration).toJSDate()
    case '2':
      return reminder.recurrence_rule
    default:
      return
  }
}

export function getRemindValueFromDefaultReminder(endTime: Date, reminder: any, config: Config) {
  // {type: string, value: string}
  // Date / Duration / RecurrenceRule
  const offset = offsetToUTCOffset(config.basic.defaultTimeOffset)
  switch (reminder.type) {
    case '0':
      return dateInputToDateTime(reminder.value, offset).toJSDate()
    case '1':
      const duration = dateInputToDuration(reminder.value)
      return DateTime.fromJSDate(endTime).minus(duration).toJSDate()
    case '2':
      // TODO: Support default interval reminder
      return
    default:
      return
  }
}
