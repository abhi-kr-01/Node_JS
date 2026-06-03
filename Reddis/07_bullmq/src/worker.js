import { Worker } from "bullmq";
import { connection } from './queue.js'

// creating worker 
const emailWorker = new Worker("emails",async (job) => {
    console.log(job.id);
    console.log(job.name);
    console.log(job.data);

},{connection});

emailWorker.on("completed",(job) => {
    console.log("job completed:" ,job.id,job.name,job.data);
})

emailWorker.on("failed",(job) => {
    console.log("job failed:" ,job.id,job.name,job.data);
})