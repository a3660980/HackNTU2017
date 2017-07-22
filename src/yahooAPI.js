import fetch from 'node-fetch';

const searchItems = (q, category='') => {
	let bidCategoryId, bidCategoryLevel, mallCategoryId, mallCategoryLevel, buyCategoryId, buyCategoryLevel;

	if(q == '') {
		return 'not search Keywords';
	}
	switch(category) {
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
	let searchQ = 'q=' + q;
	return fetch('https://tw.search.ec.yahoo.com:443/api/affiliate/v1/search/items?property=bid&sort=-sales&' + searchQ + '&' + bidCategoryId + '&' + bidCategoryLevel, {
		method: 'get'
	})
	.then((res) => {
		return res.json();
	})
	.then(json => {
		return json.items.map(data => {
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
	})
	.catch((err) => {
		console.log(err);
	})
}

export default searchItems;