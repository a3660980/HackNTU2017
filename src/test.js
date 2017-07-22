bot.on('postback', function (event) {
	let recommendNum = 10;
	let data = [];
	for(let i = 0 ; i < recommendNum ; i++){
		let num = Math.floor(Math.random() * items.length);
		let repeat = false;
		for(let j = 0 ; j < data.length ; j++){
			if(data[j] == num){
				repeat = true;
				break;
			}
		}

		if(!repeat){
			data.push(num);
		}
	}
	for(let i = 0 ; i < data.length/5 ; i++){

		let columnsData = [];

		for(let j = i*5 ; j < i*5+5 ; j++){
			columnsData.push({
				'thumbnailImageUrl': items[data[j]].imageUrl,
				'title': items[data[j]].title,
				'text': '商品價格：' + items[data[j]].price + '元',
				'actions': [
					{
					    'type': 'uri',
					    'label': '查看圖片',
					    'data': items[data[j]].imageUrl
					},
					{
					    'type': 'uri',
					    'label': '購買網頁',
					    'data': items[data[j]].url
					},
					{
					    'type': 'uri',
					    'label': '賣家資訊：' + items[data[j]].seller.title + '(' + items[data[j]].seller.rating + ')',
					    'data': items[data[j]].seller.url
					}
				]
			});
		}

		let confirmData = {
			'type': 'template',
			'altText': 'this is a carousel template',
			'template': {
				'type': 'carousel',
				'columns': columnsData
			}
		};

		event.source.profile().then(function (profile) {
			event.push(profile.userId, confirmData);
		});
	}
});