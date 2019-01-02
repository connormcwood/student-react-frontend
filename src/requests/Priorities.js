let request = require('request-promise');
const getNotesUrl = "http://127.0.0.1:8080/priority/all";

module.exports.getPriorities = ( (callback) => {
    return request({
        "method": "GET",
        "uri": getNotesUrl,
        "json": true
    })
});