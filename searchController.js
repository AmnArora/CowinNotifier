const constants = require('./constants');
const moment = require('moment');
const fetch = require('node-fetch');
const notifier = require('node-notifier');
const accountSid = "AC11f21c0ce321038293c286807feb5eea";
const authToken = "9c5fa55b177aca12abe3a16fd8b454d2";
const client = require('twilio')(accountSid, authToken);
const mobile = '+919873283013';

module.exports = {
    searchByPincode: async (pincode) => {
        console.log(`Attempting search`)
        let todaysDate = moment();
        for (var i = 0; i < 5; i++) {
            let date = todaysDate.format("DD-MM-YYYY");
            await getAvailableSlotsForDateByPincode(date, pincode);
            todaysDate = todaysDate.add(7, 'days');
        }
    },
    searchByDistrict: async (district) => {
        console.log(`Attempting search`)
        let todaysDate = moment();
        for (var i = 0; i < 5; i++) {
            let date = todaysDate.format("DD-MM-YYYY");
            await getAvailableSlotsForDateByDistrictId(date, district);
            todaysDate = todaysDate.add(7, 'days');
        }
    }
}

async function getAvailableSlotsForDateByPincode(date, pincode) {
    fetch(`${constants.CALENDER_BY_PIN}?pincode=${pincode}&date=${date}`, {
        "method": "GET",
    }).then(res => res.json())
        .then(json => {
            parseResponseAndNotify(json)
        });
}

async function getAvailableSlotsForDateByDistrictId(date, districtId) {
    fetch(`${constants.CALENDER_BY_DISTRICT}/calendarByDistrict?district_id=${districtId}&date=${date}`, {
        "method": "GET",
    }).then(res => res.json())
        .then(json => {
			parseResponseAndNotify(json);
        });
}

function parseResponseAndNotify(json) {
    if (!json || !json.centers) {
        console.log("RepsonseChangedError!");
    }
    
    json.centers.forEach(center => {
        center.sessions.forEach(session => {
            if (session.min_age_limit == 18) {
                if (session.available_capacity != 0) {
                    let alertMsg = `Found a slot at ${center.name} for date ${session.date}`;
                    notifier.notify(alertMsg);
                    console.log(alertMsg);
                    sendWhatsapp(alertMsg, mobile);
                } 
                // Uncomment for testing
                // else {
                //     let alertMsg = `Found a slot at ${center.name} for date ${session.date}`;
                //     notifier.notify(alertMsg);
                //     console.log(alertMsg);
                //     sendWhatsapp(alertMsg, mobile);
                // }
            }
        })
    });
}

function sendWhatsapp(message, number){
    client.messages 
    .create({ 
       body: message, 
       from: 'whatsapp:+14155238886',       
       to: 'whatsapp:'+number, 
     }) 
    .then(message => console.log(message.sid)) 
    .done();
}