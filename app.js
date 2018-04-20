const Client = require('node-rest-client').Client;
const schedule = require('node-schedule');
const parse = require('xml-parser');

const firingRate = 3;

const client = new Client();
const args = {
    path: {
        unique_id: "1136576",
        apikey: "qK88b0hgEBPkIk5VHRPExz3Xefw1"
    }
}

let description;
let firstRun = true;
let job = schedule.scheduleJob('*/'+firingRate+' * * * * *', (fireDate) => {
    if (firstRun) {
        console.log("firing after "+firingRate+" sec, starting at: ", fireDate);
        //firstRun=false;
    }
    client.get("http://static.cricinfo.com/rss/livescores.xml", 
args, async (data, responce) => {
        if (firstRun) {
            // console.clear(); // Uncomment this if dont want the list;
            // description = data.description;
		firstRun = false;
		const xml = parse(data).toString();
            console.log(xml);
        } 
    });
});

