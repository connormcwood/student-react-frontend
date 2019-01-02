let request = require('request-promise');

const getNotesUrl = "http://127.0.0.1:8080/note/all";
const postNotesUrl = "http://127.0.0.1:8080/note";

module.exports.getNotes = ( () => {
    return request({
        "method": "GET",
        "uri": getNotesUrl,
        "json": true
    })
});

module.exports.postNotes = ( (body) => {
    console.log(body);
    let object = {
        "title": body.title,
        "content": body.content,
        "priority": {
            "id": body.priorities
        }
    }
    return request({
        "method": "POST",
        "uri": postNotesUrl,
        "json": true,
        "body": object
    });
});