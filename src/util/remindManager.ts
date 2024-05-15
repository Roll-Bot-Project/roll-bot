import schedule, { Job } from 'node-schedule'

interface ScheduledRemind {
  id: number
  job: Job
}

class RemindManager {
  private jobs: Map<number, ScheduledRemind>

  constructor() {
    this.jobs = new Map()
  }

  addJob(id: number, rule: schedule.RecurrenceRule | string | Date, callback: () => void): boolean {
    if (this.jobs.has(id)) {
      console.error(`Remind job with id ${id} already exists`)
      return false
    }

    const job = schedule.scheduleJob(rule, callback)
    this.jobs.set(id, { id, job })
    console.log(`Remind job ${id} scheduled`)
    return true
  }

  deleteJob(id: number): boolean {
    const scheduledJob = this.jobs.get(id)
    if (scheduledJob) {
      scheduledJob.job.cancel()
      this.jobs.delete(id)
      console.log(`Remind job ${id} deleted`)
      return true
    } else {
      console.error(`Remind job with id ${id} does not exist`)
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

export default RemindManager
