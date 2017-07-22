'use strict';

var _linebot = require('linebot');

var _linebot2 = _interopRequireDefault(_linebot);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _emotibot = require('./emotibot');

var _emotibot2 = _interopRequireDefault(_emotibot);

var _yahooAPI = require('./yahooAPI');

var _yahooAPI2 = _interopRequireDefault(_yahooAPI);

var _faceAPI = require('./faceAPI');

var _faceAPI2 = _interopRequireDefault(_faceAPI);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/upload', _express2.default.static('upload'));

var bot = (0, _linebot2.default)({
	channelId: 1483028111,
	channelSecret: 'db1a928288ba09c31f6c4660aafb81fa',
	channelAccessToken: '0WOs0qRcuUwRkuyiHdyF64/xMXztUDv+3Oi+i4KFucUtMa47kEf/+s3WiBoj5CfaBzlEeWvBZ3jARKyRPG2qB8Bv0QCoSl7XsxV1r3VASpl68Oe4vbii2pbBxjsYt78HyXCQn+gtncKIpkCEvkqzFQdB04t89/1O/w1cDnyilFU=',
	verify: true // default=true
});
var linebotParser = bot.parser();

bot.on('message', function (event) {
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
					var ob = {
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
					(0, _yahooAPI2.default)('鞋', 'male').then(async function (items) {
						console.log(items);
						event.reply((await itemCard2(event, items)));
						return items;
					});
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
			event.message.content().then(async function (data) {
				_fs2.default.writeFile('upload/' + (0, _md2.default)(data.toString('base64')) + '.jpg', data, function (err) {
					if (err) console.error(err);
					console.log("圖片上傳成功");
					bot.push(event.source.userId, '資料讀取中...');
				});
				return data;
			}).then(async function (data) {
				var url = (0, _md2.default)(data.toString('base64'));
				console.log('https://4f372a0b.ngrok.io/upload/' + url + '.jpg');
				var face = await (0, _faceAPI2.default)('https://4f372a0b.ngrok.io/upload/' + url + '.jpg');
				var clothes = await (0, _emotibot2.default)('upload/' + url + '.jpg');
				console.log(face);
				if (face.people == 1) {
					if (clothes.return == 0) {
						clothes.data.forEach(function (clothesType) {
							(0, _yahooAPI2.default)(clothesType, face.gender).then(async function (items) {
								console.log(clothesType);

								var mes = await itemCard2(event, items);
								console.log(mes);
								bot.push(event.source.userId, mes);
							});
						});
						event.reply('');
					} else {
						event.reply('請重新上傳更清楚的照片');
					}
				} else {
					event.reply('照片不清楚或者人數不是1人');
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

bot.on('postback', function (event) {});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

app.post('/linewebhook', linebotParser);
app.listen(3000);

var itemCard2 = async function itemCard2(event, items) {
	var columnsData = [];
	var confirmData = [];
	items.forEach(function (item) {
		var image = item.imageUrl || '';
		var title1 = item.title.substring(0, 20);
		var price = '\u5546\u54C1\u50F9\u683C\uFF1A' + item.price + '\u5143\n\t\t\t\t\t\t\t\t \u8A55\u50F9\uFF1A' + item.seller.rating;
		var data1 = item.imageUrl;
		var data2 = item.url;
		var label1 = '\u8CE3\u5BB6\u8CC7\u8A0A\uFF1A' + item.seller.title + '(' + item.seller.rating + ')';
		var data3 = item.seller.url;
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
		});
	});

	return {
		type: 'template',
		altText: '商品資訊',
		template: {
			type: 'carousel',
			columns: columnsData
		}
	};
};