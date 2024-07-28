import { CronJob } from 'cron';

export const job = CronJob.from({
  cronTime:'* * * * * *',
  onTick: function (){
    console.log('You will see this message every second', Date())
    
  },
  start: false
})

