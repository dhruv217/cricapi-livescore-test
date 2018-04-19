const Client = require('node-rest-client').Client;
const schedule = require('node-schedule');

const firingRate = 3;

const client = new Client();
const args = {
    path: {
        unique_id: "1136576",
        apikey: "qK88b0hgEBPkIk5VHRPExz3Xefw1"
    }
}

let stat;
let firstRun = true;
let job = schedule.scheduleJob('*/'+firingRate+' * * * * *', (fireDate) => {
    if (firstRun) {
        console.log("firing after "+firingRate+" sec, starting at: ", fireDate);
        firstRun = false;
    }
    client.get("http://cricapi.com/api/cricketScore/?unique_id=${unique_id}&apikey=${apikey}", args, (data, responce) => {
        if (stat !== data.stat) {
            // console.clear(); // Uncomment this if dont want the list;
            stat = data.stat;
            console.log(stat);
        } 
    });
});

