import linebot from 'linebot';
import fs from 'fs';
import searchClothes from './emotibot';
import searchItems from './yahooAPI';
import faceAPI from './faceAPI';
import express from 'express';
import md5 from 'md5';

const app = express();

app.use('/upload', express.static('upload'));

const bot = linebot({
	channelId: '',
	channelSecret: '',
	channelAccessToken: '',
	verify: true // default=true
});
const linebotParser = bot.parser();

bot.on('message', (event) => {
	switch (event.message.type) {
		case 'text':
			switch (event.message.text) {
				case 'Location':
					event.reply({
						type: 'location',
						title: 'LINE Plus Corporation',
						address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
						latitude: 13.7202068,
						longitude: 100.5298698
					});
					break;
				case 'Push':
					//bot.push('U6350b7606935db981705282747c82ee1', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
					break;
				case 'Push2':
					//bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
					break;
				case 'Multicast':
					//bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], 'Multicast!');
					break;
				case 'Version':
					event.reply('linebot@' + require('../package.json').version);
					break;
				case 'test':
					searchItems('鞋', 'male').then(async (items) => {	
						console.log(items)
						event.reply(await itemCard2(event, items));
						return items;
					})
					break;
				default:
					event.reply(event.message.text).then(function (data) {
						console.log('Success', event.source.userId, event.message.text);
					}).catch(function (error) {
						console.log('Error', error);
					});
					break;
			}
			break;
		case 'image':
			event.message.content().then(async (data) => {
 				fs.writeFile('upload/' + md5(data.toString('base64')) + '.jpg', data, err => {
					if (err) console.error(err);
					console.log("圖片上傳成功");
					bot.push(event.source.userId , '資料讀取中...');
				});
				return data;
			}).then(async (data)=>{
				let url = md5(data.toString('base64'));
				console.log(`https://4f372a0b.ngrok.io/upload/${url}.jpg`)
				let face = await faceAPI(`https://4f372a0b.ngrok.io/upload/${url}.jpg`);
				let clothes = await searchClothes(`upload/${url}.jpg`);
				if (face.people == 1) {
					if(clothes.return == 0 ) {
						clothes.data.forEach(async(clothesType) => {
							searchItems(clothesType, face.gender)
							.then(async (items) => {
								console.log(clothesType)
								let mes = await itemCard2(event, items);
								console.log(mes)
								bot.push(event.source.userId , mes);
							})
						})
						event.reply('商品推送完畢');
						
					} else {
						event.reply('請重新上傳更清楚的照片');
					}
				} else {
					event.reply('照片不清楚或者人數不是1人');
				}
			})
			
			break;
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
		default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
});

bot.on('follow', function (event) {
});

bot.on('unfollow', function (event) {
});

bot.on('join', function (event) {
});

bot.on('leave', function (event) {
});

bot.on('postback', function (event) {
});

bot.on('beacon', function (event) {
});

app.post('/linewebhook', linebotParser);
app.listen(3000);

const itemCard2 = async (event, items) => {
	let columnsData = [];
	let confirmData = [];
	let arr = getRandomArray(0, 49, 5);
	let i = 0;
	items.forEach((item) => {
		if(arr.indexOf(i) > -1) {
		let image = item.imageUrl || '';
		let title1 = item.title.substring(0, 20);
		let price = `商品價格：${item.price}元
								 評價：${item.seller.rating}`;
		let data1 = item.imageUrl;
		let data2 = item.url;
		let label1 = `賣家資訊：${item.seller.title}(${item.seller.rating})`;
		let data3 = item.seller.url
		columnsData.push({
			thumbnailImageUrl: image,
			title: title1,
			text: price,
			actions: [{
				type: 'uri',
				label: '查看圖片',
				uri: data1
			}, {
				type: 'uri',
				label: '購買網頁',
				uri: data2
			}, {
				type: 'uri',
				label: '賣家資訊',
				uri: data3
			}]
		}) 
		}
		i += 1
	})

	return {
			type: 'template',
			altText: '商品資訊',
			template: {
				type: 'carousel',
				columns: columnsData
			}
		};
	};

function getRandom(minNum, maxNum) {	//取得 minNum(最小值) ~ maxNum(最大值) 之間的亂數
	return Math.floor( Math.random() * (maxNum - minNum + 1) ) + minNum;
}

function getRandomArray(minNum, maxNum, n) {	//隨機產生不重覆的n個數字
	var rdmArray = [n];		//儲存產生的陣列

	for(var i=0; i<n; i++) {
		var rdm = 0;		//暫存的亂數

		do {
			var exist = false;			//此亂數是否已存在
			rdm = getRandom(minNum, maxNum);	//取得亂數

			//檢查亂數是否存在於陣列中，若存在則繼續回圈
			if(rdmArray.indexOf(rdm) != -1) exist = true;

		} while (exist);	//產生沒出現過的亂數時離開迴圈

		rdmArray[i] = rdm;
	}
	return rdmArray;
}
