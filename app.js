const Client = require('node-rest-client').Client,
      schedule = require('node-schedule'),
      xml2js = require('xml2js');
let Parser = require('rss-parser');
let RSSParser = new Parser();

const XMLParser = new xml2js.Parser();
const client = new Client();

const firingRate = 3;


let matchTitle;
let firstRun = true;
let jobESPN = schedule.scheduleJob('*/'+firingRate+' * * * * *', async (fireDate) => {
    if (firstRun) {
        console.log("firing after "+firingRate+" sec, starting at: ", fireDate.toLocaleString());
        firstRun=false;
    }
    let feed = await RSSParser.parseURL('http://static.cricinfo.com/rss/livescores.xml');
    // console.log(feed);
    for (const item of feed.items) {
        const title = item.title.toString();
        const regex = /\bChennai|\bSuper|\bKings|\bRajasthan|\bRoyals/igm;
        // console.log('text serach result :', title.search(regex));
        if(title.search(regex) > -1 && matchTitle !== title){
            matchTitle = title;
            console.log(matchTitle);
        }
    }
});


let btTm = { Inngs: { '$': { r: undefined } } },
    blgTm = { Inngs: { '$': { r: undefined } } };
let jobCricBuzz = schedule.scheduleJob('*/' + firingRate + ' * * * * *', async (fireDate) => {
    if (firstRun) {
        console.log("firing after " + firingRate + " sec, starting at: ", fireDate.toLocaleString());
    }
    client.get("http://synd.cricbuzz.com/j2me/1.0/livematches.xml", (data, responce) => {
        XMLParser.parseString(data, function (err, result) {
            let feed = data.mchdata.match;
            for (const match of feed) {
                // console.log(match)
               try {
		if (match['$'].id === '4') {
                        btTm = match.mscr.btTm;
			blgTm = match.mscr.blgTm;
                        if (blgTm.Inngs === undefined){
                            console.log(btTm['$'].sName+" "+btTm.Inngs['$'].r+"/"+btTm.Inngs['$'].wkts+" * v "+ blgTm['$'].sName);
                        } else {
                            console.log(btTm['$'].sName + " " + btTm.Inngs['$'].r + "/" + 
					btTm.Inngs['$'].wkts + " * v " + blgTm['$'].sName + 
					blgTm.Inngs['$'].r + "/" + blgTm.Inngs['$'].wkts);
			    console.log("Overs : "+btTm.Inngs['$'].ovrs);
                    }
                }
		} catch (err) {
			console.log(err);
		}
            } 
        });
    });
});
