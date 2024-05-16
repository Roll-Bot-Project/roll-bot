import schedule, { Job } from 'node-schedule'
import {logger} from "../index";

interface ScheduledRemind {
  id: number
  job: Job
}

class AutoEndManager {
  private jobs: Map<number, ScheduledRemind>

  constructor() {
    this.jobs = new Map()
  }

  addJob(id: number, rule: schedule.RecurrenceRule | string | Date, callback: () => void): boolean {
    if (this.jobs.has(id)) {
      logger.warn(`Auto end job with id ${id} already exists`)
      return false
    }

    const job = schedule.scheduleJob(rule, callback)
    this.jobs.set(id, { id, job })
    logger.success(`Auto end job ${id} scheduled`)
    return true
  }

  deleteJob(id: number): boolean {
    const scheduledJob = this.jobs.get(id)
    if (scheduledJob) {
      scheduledJob.job.cancel()
      this.jobs.delete(id)
      logger.success(`Auto end job ${id} deleted`)
      return true
    } else {
      logger.warn(`Auto end job with id ${id} does not exist`)
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

export default AutoEndManager
