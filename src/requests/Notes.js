let request = require("request-promise");

const baseUrl = "http://127.0.0.1:8080";
const getNotesUrl = baseUrl + "/note/all";
const postNotesUrl = baseUrl + "/note";
const deleteNotesUrl = baseUrl + "/note/";
const reorderNotesUrl = baseUrl + "/note/reorder";

exports.getNotes = ( () => {
	return request({
		"method": "GET",
		"uri": getNotesUrl,
		"json": true
	});
});

exports.deleteNotes = ( (ids) => {
	return request({
		"method": "DELETE",
		"uri": deleteNotesUrl + ids,
		"json": true
	});
});

module.exports.postNotes = ( (body) => {
	console.log(body);
	let object = {
		"title": body.title,
		"content": body.content,
		"priority": {
			"id": body.priorities
		}
	};
	return request({
		"method": "POST",
		"uri": postNotesUrl,
		"json": true,
		"body": object
	});
});

module.exports.reorderNotes = ( (body) => {
	return request({
		"method": "PATCH",
		"uri": reorderNotesUrl,
		"json": true,
		"body": body
	})
})