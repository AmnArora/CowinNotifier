const fetch = require('node-fetch');
const constants = require('./constants')

module.exports = {
    getStates: () => {
        return new Promise((resolve, reject) => {
            fetch(constants.STATES, {
                "method": "GET",
            }).then(res => res.json())
                .then(json => {
                    resolve(json.states);
                });
        })

    },
    getDistrictsFromStateId: (stateId) => {
        return new Promise((resolve, reject) => {
            fetch(`${constants.DISTRICTS}/${stateId}`, {
                "method": "GET"
            }).then(res => res.json())
                .then(json => {
                    resolve(json.districts);
                });
        })

    }
}

