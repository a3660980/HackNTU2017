'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchItems = async function searchItems(q) {
	var category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	var bidCategoryId = void 0,
	    bidCategoryLevel = void 0,
	    mallCategoryId = void 0,
	    mallCategoryLevel = void 0,
	    buyCategoryId = void 0,
	    buyCategoryLevel = void 0;

	if (q == '') {
		return 'not search Keywords';
	}
	switch (category) {
		case '':
			return 'not search Category';
			break;
		case 'girl':
			bidCategoryId = 'categoryId=23000';
			bidCategoryLevel = 'categoryLevel=0';
			break;
		case 'boy':
			bidCategoryId = 'categoryId=5299020';
			bidCategoryLevel = 'categoryLevel=0';
			break;
	}
	var searchQ = 'q=' + q;

	return (0, _nodeFetch2.default)('https://tw.search.ec.yahoo.com:443/api/affiliate/v1/search/items?property=bid&sort=-sales&' + searchQ + '&' + bidCategoryId + '&' + bidCategoryLevel, {
		method: 'get'
	}).then(function (res) {
		return res.json();
	}).then(function (json) {
		console.log(json);
		return json.items.map(function (data) {
			return {
				title: data.title,
				imageUrl: data.imageUrl,
				price: data.price,
				url: data.url,
				seller: {
					title: data.seller.title,
					rating: data.seller.rating,
					url: data.seller.url
				}
			};
		});
	}).catch(function (err) {
		console.log(err);
	});
};

searchItems("衣", "girl").then(function (data) {});

exports.default = searchItems;