const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const Connection = require("../models/connection");
const sendEmail = require('./sendEmail');

// cron.schedule('* * * * * *', () => {
//   console.log('running a task every second');
// });

cron.schedule('10 17 * * *', async () => {
    //send email to all ppl who got request prev day
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await Connection.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId")

        const list = [...new Set(pendingRequests.map(req=>req.toUserId.email))];
        console.log(list)

        for(const email of list) {
            try {
                const emailRes = await sendEmail.run(`New Friend request pending for ${email}`);
                console.log(emailRes)
            }catch(err) {
                console.log(err)
            }
        }
    }
    catch(err) {
        console.error(err);
    }
});