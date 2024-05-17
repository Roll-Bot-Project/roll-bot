import schedule, { Job } from 'node-schedule'
import {logger} from "../index";

interface ScheduledRemind {
  id: number
  job: Job
}

class ExpireManager {
  private jobs: Map<number, ScheduledRemind>

  constructor() {
    this.jobs = new Map()
  }

  addJob(id: number, rule: schedule.RecurrenceRule | string | Date, callback: () => void): boolean {
    if (this.jobs.has(id)) {
      logger.warn(`Expire task of roll ${id} already exists`)
      return false
    }

    const job = schedule.scheduleJob(rule, callback)
    this.jobs.set(id, { id, job })
    logger.success(`Expire task of roll ${id} scheduled`)
    return true
  }

  deleteJob(id: number): boolean {
    const scheduledJob = this.jobs.get(id)
    if (scheduledJob) {
      scheduledJob.job.cancel()
      this.jobs.delete(id)
      logger.success(`Expire task of roll ${id} deleted`)
      return true
    } else {
      logger.warn(`Expire task of roll ${id} does not exist`)
      return false
    }
  }

  getJob(id: number): Job | undefined {
    const scheduledJob = this.jobs.get(id)
    return scheduledJob?.job
  }

  getAllJobs(): ScheduledRemind[] {
    return Array.from(this.jobs.values())
  }
}

export default ExpireManager
