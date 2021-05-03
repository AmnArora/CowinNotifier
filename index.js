const colors = require("colors/safe");
const moment = require('moment');

var prompt = require('prompt');

const promptController = require('./PromptController');
const searchController = require('./searchController')

prompt.message = colors.cyan("Cowin Availability check!");
prompt.start();
(async () => {
    const searchBy = await promptController.promptForInitialChoice();
    const frequency = await promptController.promptForFrequency();
    
    let startDate = moment();
    let endDate = moment().add(35, 'days');

    if (searchBy == 0) {
        // prompt for districtId
        const districtId = await promptController.promptForDistrictId();
    
        console.log(`Checking for availability from ${startDate.format("DD-MMM")} to ${endDate.format("DD-MMM")} for district Id: ${districtId}; Frequency: ${frequency}`)
        searchController.searchByDistrict(districtId)
        setInterval(async () => {
            searchController.searchByDistrict(districtId)
        }, (frequency * 60000))

    } else {
        // prompt for pincode
        const pincode = await promptController.promptForPincode();
        console.log(`Checking for availability from ${startDate.format("DD-MMM")} to ${endDate.format("DD-MMM")} for pincode: ${pincode}; Frequency: ${frequency}`)
        searchController.searchByPincode(pincode)
        setInterval(async () => {
            searchController.searchByPincode(pincode)
        }, (frequency * 60000))

    }
})();