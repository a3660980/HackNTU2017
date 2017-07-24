'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _urlencode = require('urlencode');

var _urlencode2 = _interopRequireDefault(_urlencode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchItems = async function searchItems(q) {
	var category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	var bidCategoryId = void 0,
	    bidCategoryLevel = void 0;

	if (q == '') {
		return 'not search Keywords';
	}
	switch (category) {
		case '':
			return 'not search Category';
			break;
		case 'female':
			bidCategoryId = 'categoryId=23000';
			bidCategoryLevel = 'categoryLevel=0';
			break;
		case 'male':
			bidCategoryId = 'categoryId=5299020';
			bidCategoryLevel = 'categoryLevel=0';
			break;
	}
	var searchQ = 'q=' + (0, _urlencode2.default)(q);

	return (0, _nodeFetch2.default)('https://tw.search.ec.yahoo.com:443/api/affiliate/v1/search/items?property=bid&limit=50&sort=rel&q=' + searchQ + '&' + bidCategoryId + '&' + bidCategoryLevel, {
		method: 'get'
	}).then(function (res) {
		return res.json();
	}).then(function (json) {
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

exports.default = searchItems;