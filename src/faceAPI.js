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
		if(res.status == 200){
			return res.json();
		}else{
			return 'error';
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