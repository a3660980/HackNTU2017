import fetch from 'node-fetch';

const key = '68da1b8e09b6453bb8d81f100ae0984f';

const faceAPI = async (image) => {
	return fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': '68da1b8e09b6453bb8d81f100ae0984f'
		},
		body: JSON.stringify({
	    	'url': image
		})
	}).then((res) => {
		return res.json();
	}).then((json) => {
		if (json.length == 0) {
			return {
				people: 0
			}
		}else if (json.length == 1) {
			return {
					people: 1,
					gender: json[0].faceAttributes.gender,
					age: json[0].faceAttributes.age,
					emotion: json[0].faceAttributes.emotion
				}
		} else {
			return {
				people: 2
			}
		}
	})
	.then(face => {
		return face;
	})
	.catch((err) => {
		console.log(err);
	});
}

export default faceAPI;