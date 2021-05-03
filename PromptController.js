const prompt = require('prompt');
const colors = require("colors/safe");
const { printTable } = require('console-table-printer');
var _ = require('lodash');

const statesController = require('./states')


module.exports = {
    promptForInitialChoice: async () => {
        try {
            const result = await prompt.get([{
                name: 'searchBy',
                description: colors.white("Enable search by: (district=0; pincode=1)"),
                type: "integer",
                required: true,
                conform: function (value) {
                    return (value >= 0 && value <= 1);
                }
            }]);
            return result.searchBy;
        } catch (err) {
            console.log("Got Error" + err)
        }
    },

    promptForDistrictId: async () => {
        const states = await statesController.getStates();
        console.log("Available States")
        printTable(states);

        const stateIds = _.map(states, (value) => {
            return value.state_id;
        });
    
        try {
            let stateResult = await prompt.get([{
                name: 'stateId',
                description: colors.white("Please enter the state Id"),
                required: true,
                type: "integer",
                conform: function (value) {
                    return stateIds.indexOf(value) != -1;
                }
            }]);
            const districts = await statesController.getDistrictsFromStateId(stateResult.stateId);
            console.log("Available Districts")
            printTable(districts);

            const districtIds = _.map(districts, (value) => {
                return value.district_id;
            });
        
            let districtResult = await prompt.get([{
                name: 'districtId',
                description: colors.white("Please enter the district Id"),
                required: true,
                type: "integer",
                conform: function (value) {
                    return districtIds.indexOf(value) != -1;
                }
            }]);
            return districtResult.districtId;
        } catch (error) {
            console.log("Got Error" + err)
        }
    },

    promptForFrequency: async () => {
        try {
            let result = await prompt.get([{
                name: 'frequency',
                description: colors.white("Enter the frequency of checking (in min)"),
                required: true,
                type: "integer"
            }]);
            return result.frequency;
        } catch (error) {
            console.log("Got Error" + err)
        }
    },

    promptForPincode: async () => {
        try {
            let result = await prompt.get([{
                name: 'pincode',
                description: colors.white("Enter the pincode"),
                required: true
            }]);
            return result.pincode;
        } catch (error) {
            console.log("Got Error" + err)
        }
        
    }
}