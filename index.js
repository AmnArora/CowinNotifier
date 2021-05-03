const fetch = require('node-fetch');
const moment = require('moment');
var prompt = require('prompt');
var colors = require("colors/safe");
const notifier = require('node-notifier');

prompt.message = colors.cyan("Cowin Availability check!");

prompt.start();

prompt.get([{
    name: 'searchCriteria',
    description: colors.white("Enter search criteria 1. search by pincode 2. search by district"),
    required: true,
    type: 'integer'
}], function (err, result) {
    if (result.searchCriteria === 1) {
        searchByPinCode();
    } else if(result.searchCriteria === 2) {
        searchByDistrict();
    } else {
        console.log("Unknown option!");
    }
})

function searchByPinCode() {
    prompt.get([{
        name: 'pincode',
        description: colors.white("Enter the pincode"),
        required: true
    },
    {
        name: 'frequency',
        description: colors.white("Enter the frequency of checking (in min)"),
        required: true,
        type: "integer"
    }], function (err, result) {
        result.searchCriteria = 1;
        let startDate = moment();
        let endDate = moment().add(35, 'days');
        console.log(`Checking for availability from ${startDate.format("DD-MMM")} to ${endDate.format("DD-MMM")} for pincode ${result.pincode}; Frequency: ${result.frequency}`)
        
        check(result);
        setInterval(async () => {
            check(result);
        }, (result.frequency * 60000))
    });
}

function searchByDistrict() {
    prompt.get([{
        name: 'districtId',
        description: colors.white("Enter districtId"),
        required: true
    },
    {
        name: 'frequency',
        description: colors.white("Enter the frequency of checking (in min)"),
        required: true,
        type: "integer"
    }], function (err, result) {
        result.searchCriteria = 2;
        let startDate = moment();
        let endDate = moment().add(35, 'days');
        console.log(`Checking for availability from ${startDate.format("DD-MMM")} to ${endDate.format("DD-MMM")} for districtId ${result.districtId}; Frequency: ${result.frequency}`)
        
        check(result);
        setInterval(async () => {
            check(result);
        }, (result.frequency * 60000))
    });
    
}

async function check(result) {
    console.log(`Attempting search`)
    let todaysDate = moment();
    for (var i = 0; i < 5; i++) {
        let date = todaysDate.format("DD-MM-YYYY");
        if (result.searchCriteria === 1) {
            await getAvailableSlotsForDate(date, result.pincode);
        } else if (result.searchCriteria === 2) {
            await getAvailableSlotsByDistrict(date, result.districtId)
        }
        todaysDate = todaysDate.add(7, 'days');
    }
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
                    console.log(alertMsg)
                }
            }
        })
    });
    
}

const apiEndPoint = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public';

async function getAvailableSlotsByDistrict(date, districtId) {
    fetch(`${apiEndPoint}/calendarByDistrict?district_id=${districtId}&date=${date}`, {
        "method": "GET",
    }).then(res => res.json())
        .then(json => {
			parseResponseAndNotify(json);
        });
}

async function getAvailableSlotsForDate(date, pincode) {
    fetch(`${apiEndPoint}/calendarByPin?pincode=${pincode}&date=${date}`, {
        "method": "GET",
    }).then(res => res.json())
        .then(json => {
			parseResponseAndNotify(json);
        });
}
