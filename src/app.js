import linebot from 'linebot';
import fs from 'fs';
import searchClothes from './emotibot';
import searchItems from './yahooAPI';
import faceAPI from './faceAPI';
import express from 'express';
const app = express();

app.use('/upload', express.static('upload'))

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
						altText: 'this is a confirm template',
						template: {
							type: 'confirm',
							text: 'Are you sure?',
							actions: [{
								type: 'message',
								label: 'Yes',
								text: 'yes'
							}, {
								type: 'message',
								label: 'No',
								text: 'no'
							}]
						}
					});
					break;
				case 'Multiple':
					return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
					break;
				case 'Version':
					event.reply('linebot@' + require('../package.json').version);
					break;
				case 'test':
					searchItems('上衣', 'male').then((item)=>{
						console.log('item', item);
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
 				await fs.writeFile('upload/' + event.source.userId + '.jpg', data, err => {
					if (err) console.error(err);
					console.log("圖片上傳成功");
				});
				let clothes = await searchClothes('upload/' + event.source.userId + '.jpg');
				let face = await faceAPI('https://d07a9e99.ngrok.io/upload/' + event.source.userId + '.jpg');
				if (face.people ==1) {
					if(clothes.return == 0 ) {
						let item = await searchItems('上衣', 'male');
						console.log('item', item);
						event.reply(item);
					}
				}
			});
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
	event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

app.post('/linewebhook', linebotParser);
app.listen(3000);