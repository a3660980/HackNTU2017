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
	channelId: 1483028111,
	channelSecret: 'db1a928288ba09c31f6c4660aafb81fa',
	channelAccessToken: '0WOs0qRcuUwRkuyiHdyF64/xMXztUDv+3Oi+i4KFucUtMa47kEf/+s3WiBoj5CfaBzlEeWvBZ3jARKyRPG2qB8Bv0QCoSl7XsxV1r3VASpl68Oe4vbii2pbBxjsYt78HyXCQn+gtncKIpkCEvkqzFQdB04t89/1O/w1cDnyilFU=',
	verify: true // default=true
});
const linebotParser = bot.parser();

bot.on('message', (event) => {
	switch (event.message.type) {
		case 'text':
			switch (event.message.text) {
				case 'Me':
					event.source.profile().then(function (profile) {
						return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
					});
					break;
				case 'Picture':
					event.reply({
						type: 'image',
						originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
						previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
					});
					break;
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
					bot.push('U6350b7606935db981705282747c82ee1', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
					break;
				case 'Push2':
					bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
					break;
				case 'Multicast':
					bot.push(['U6350b7606935db981705282747c82ee1', 'U6350b7606935db981705282747c82ee1'], 'Multicast!');
					break;
				case 'Confirm':
					event.reply({
						type: 'template',
						altText: 'this is a carousel template',
						template: {
							type: 'carousel',
							columns: [{
								thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
								title: 'this is menu',
								text: 'description',
								actions: [{
									type: 'postback',
									label: 'Buy',
									data: 'action=buy&itemid=111'
								}, {
									type: 'postback',
									label: 'Add to cart',
									data: 'action=add&itemid=111'
								}, {
									type: 'uri',
									label: 'View detail',
									uri: 'http://example.com/page/111'
								}]
							}, {
								thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
								title: 'this is menu',
								text: 'description',
								actions: [{
									type: 'postback',
									label: 'Buy',
									data: 'action=buy&itemid=222'
								}, {
									type: 'postback',
									label: 'Add to cart',
									data: 'action=add&itemid=222'
								}, {
									type: 'uri',
									label: 'View detail',
									uri: 'http://example.com/page/222'
								}]
							}]
						}
					});
					break;
				case 'Multiple':
					let ob = {
						type: 'template',
						altText: 'this is a carousel template',
						template: {
							type: 'carousel',
							columns: [{
								thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
								title: 'this is menu',
								text: 'description',
								actions: [{
									type: 'postback',
									label: 'Buy',
									data: 'action=buy&itemid=111'
								}, {
									type: 'postback',
									label: 'Add to cart',
									data: 'action=add&itemid=111'
								}, {
									type: 'uri',
									label: 'View detail',
									uri: 'http://example.com/page/111'
								}]
							}, {
								thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
								title: 'this is menu',
								text: 'description',
								actions: [{
									type: 'postback',
									label: 'Buy',
									data: 'action=buy&itemid=222'
								}, {
									type: 'postback',
									label: 'Add to cart',
									data: 'action=add&itemid=222'
								}, {
									type: 'uri',
									label: 'View detail',
									uri: 'http://example.com/page/222'
								}]
							}]
						}
					};
					return event.reply([ob]);
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
				console.log(face)
				if (face.people == 1) {
					if(clothes.return == 0 ) {
						clothes.data.forEach((clothesType) => {
								searchItems(clothesType, face.gender).then(async (items) => {
								console.log(clothesType)
									
									let mes = await itemCard2(event, items);
									console.log(mes)
									bot.push(event.source.userId , mes);
								})
						})
						event.reply('');
						
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
	event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
	event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

app.post('/linewebhook', linebotParser);
app.listen(3000);

const itemCard2 = async (event, items) => {
	let columnsData = [];
	let confirmData = [];
	items.forEach(item => {
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
	})

	return {
			type: 'template',
			altText: '商品資訊',
			template: {
				type: 'carousel',
				columns: columnsData
			}
		};
	}