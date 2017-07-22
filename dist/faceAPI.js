'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = '68da1b8e09b6453bb8d81f100ae0984f';

var faceAPI = async function faceAPI(image) {
	(0, _nodeFetch2.default)('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': '68da1b8e09b6453bb8d81f100ae0984f'
		},
		body: JSON.stringify({
			'url': image
		})
	}).then(function (res) {
		if (res.status == 200) {
			return res.json();
		} else {
			return 'error';
		}
	}).then(function (face) {
		return face;
	}).catch(function (err) {
		console.log(err);
	});
};

exports.default = faceAPI;