import fetch from 'node-fetch';
import urlencode from 'urlencode';

const searchItems = (q, category = '') => {
	let bidCategoryId, bidCategoryLevel;

	if(q == '') {
		return 'not search Keywords';
	}
	switch(category) {
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
	let searchQ ='q=' + urlencode(q);

	
	return fetch(`https://tw.search.ec.yahoo.com:443/api/affiliate/v1/search/items?property=bid&limit=50&sort=-sales&q=${searchQ}&${bidCategoryId}&${bidCategoryLevel}`, {
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