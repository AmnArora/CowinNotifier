const fetch = require('node-fetch');

module.exports = {
    getStates: () => {
        fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states", {
            "body": null,
            "method": "GET",
            "mode": "cors"
        }).then(res => res.json())
            .then(json => {
                return json.states;
            });
    },
    getDistrictsFromStateId: (stateId) => {
        fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`, {
            "method": "GET",
            "mode": "cors"
        }).then(res => res.json())
        .then(json => {
            console.log(json.districts);
            return json.districts;
        });
    }
}

