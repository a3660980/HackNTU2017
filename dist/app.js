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
					(0, _yahooAPI2.default)('上衣', 'male').then(function (items) {
						var title1 = items[0].title;
						var price = '\u5546\u54C1\u50F9\u683C\uFF1A' + items[0].price + '\u5143';
						var data1 = items[0].imageUrl;
						var data2 = items[0].url;
						var label1 = '\u8CE3\u5BB6\u8CC7\u8A0A\uFF1A' + items[0].seller.title + '(' + items[0].seller.rating + ')';
						var data3 = items[0].seller.url;
						var ob = {
							type: 'template',
							altText: 'this is a carousel template',
							template: {
								type: 'carousel',
								columns: [{
									thumbnailImageUrl: items[0].imageUrl,
									title: title1.substring(0, 20),
									text: '\u5546\u54C1\u50F9\u683C\uFF1A' + items[0].price + '\u5143',
									actions: [{
										type: 'uri',
										label: '查看圖片',
										uri: items[0].imageUrl
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
									thumbnailImageUrl: items[1].imageUrl,
									title: '123123',
									text: '\u5546\u54C1\u50F9\u683C\uFF1A' + items[1].price + '\u5143',
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
						event.reply(itemCard2(event, items));
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
				await _fs2.default.writeFile('upload/' + event.source.userId + '.jpg', data, function (err) {
					if (err) console.error(err);
					console.log("圖片上傳成功");
				});
				var clothes = await (0, _emotibot2.default)('upload/' + event.source.userId + '.jpg');
				var face = await (0, _faceAPI2.default)('https://d07a9e99.ngrok.io/upload/' + event.source.userId + '.jpg');
				if (face.people == 1) {
					if (clothes.return == 0) {
						var item = await (0, _yahooAPI2.default)(clothes.data[0], face.gender);
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

bot.on('postback', function (event) {});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

app.post('/linewebhook', linebotParser);
app.listen(3000);

var itemCard2 = function itemCard2(event, items) {
	var columnsData = [];
	var confirmData = [];
	for (var i = 0; i < 5; i++) {
		var image = items[i].imageUrl;
		var title1 = items[i].title.substring(0, 20);
		var price = '\u5546\u54C1\u50F9\u683C\uFF1A' + items[i].price + '\u5143';
		var data1 = items[i].imageUrl;
		var data2 = items[i].url;
		var label1 = '\u8CE3\u5BB6\u8CC7\u8A0A\uFF1A' + items[i].seller.title + '(' + items[i].seller.rating + ')';
		var data3 = items[i].seller.url;
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
				label: label1.substring(0, 20),
				uri: data3
			}]
		});
	};
	confirmData.push({
		type: 'template',
		altText: '商品資訊',
		template: {
			type: 'carousel',
			columns: columnsData
		}
	});
	return confirmData;
};