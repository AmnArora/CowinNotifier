const fetch = require('node-fetch');
const moment = require('moment');
var prompt = require('prompt');
var colors = require("colors/safe");
const notifier = require('node-notifier');

const statesController = require('./states');

prompt.message = colors.cyan("Cowin Availability check!");

prompt.start();

prompt.get([{
    name: 'searchBy',
    description: colors.white("Enable search by: (district=0; pincode=1)"),
    type: "integer",
    required: true,
    conform: function (value) {
        return (value >= 0 && value <= 1);
    }
}], async function (err, result) {
    let searchBy = result.searchBy;
    if (searchBy == 1) {
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
            let startDate = moment();
            let endDate = moment().add(35, 'days');
            console.log(`Checking for availability from ${startDate.format("DD-MMM")} to ${endDate.format("DD-MMM")} for pincode ${result.pincode}; Frequency: ${result.frequency}`)

            check(result.pincode);
            setInterval(async () => {
                check(result.pincode);
            }, (result.frequency * 60000))
        });
    } else if (searchBy == 0) {
        const states =  statesController.getStates();
    
        let result = await prompt.get([{
            name: 'stateId',
            description: colors.white("Enter the state Id"),
            required: true,
            type: "integer"
        }]);
        const districts = statesController.getDistrictsFromStateId(result.stateId);

    }
});

async function check(pincode) {
    console.log(`Attempting search`)
    let todaysDate = moment();
    for (var i = 0; i < 5; i++) {
        let date = todaysDate.format("DD-MM-YYYY");
        await getAvailableSlotsForDate(date, pincode);
        todaysDate = todaysDate.add(7, 'days');
    }
}

async function getAvailableSlotsForDate(date, pincode) {
    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`, {
        "method": "GET",
    }).then(res => res.json())
        .then(json => {
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
        });
}