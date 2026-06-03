import {Queue} from 'bullmq';

const connection = {
    host: "localhost",
    port: 6379
}

// making queue for any jobs
const emailQueue = new Queue("emails",{connection});

module.exports = {
    connection, emailQueue
}

