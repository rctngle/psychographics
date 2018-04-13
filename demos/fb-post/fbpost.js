// https://developers.facebook.com/tools/accesstoken/
// https://developers.facebook.com/tools/explorer
// control + C to stop
// https://rectangle.design/dev/facebook/

const postFrequency = 90; // seconds

function getPostMessage(product, category) {
	const templates = [
		`OMG! ${product} is my favourite ${category} of all time`,
		`If you like ${category} you'll love ${product}!`,
		`I wish I could have some ${product}, absolutely best ${category}!`,
		`Really looking forward for ${product}, absolutely best ${category}!`,
		`${product} is definitely my favourite ${category} ever!`,
	];
	return templates[Math.floor(Math.random() * templates.length)];
}


const FB = require('fb');
const fs = require('fs');
const EOL = require('os').EOL;

const accessToken = "EAAEOPyKsOwUBAMZA2gSrtZCcEhxZCho8QposEBZBb9IMJhPHgwvglvBblOLsUWmrfHFE7P22QOm1ukgLjTuEcnc173x8BZB299O7yJNGFxQLWARTRx2cNaBPZAQEy7BRXeqnoy1iVIlnmogTZBFqZBXSnhAFAtsjCN3JZB3S4mFKRXmfNVvIhy70nWxcWoiTQDMcb45k9rm2nVwZDZD";

FB.setAccessToken(accessToken);

const productCategories = [];
const productCategoriesList = [];

const files = fs.readdirSync('./products');
files.forEach((file) => {
	if (file.indexOf('.txt') >= 0) {

		const category = file.replace('.txt', '');

		const productCategory = {
			name: category,
			products: [],
		};

		const contents = fs.readFileSync('./products/' + file, 'utf8');
		contents.split(EOL).forEach((product) => {
			productCategory.products.push(product);
			productCategoriesList.push({ category: category, product: product })
		});
		
		productCategories.push(productCategory);		
	}
});

function createPost() {

	const productCategory = productCategoriesList[(Math.floor(Math.random() * productCategoriesList.length))];
	const product = productCategory.product;
	const category = productCategory.category;
	const body = getPostMessage(product, category);		
	
	fs.appendFileSync('posts.txt', body+EOL);

	console.log(body);

	FB.api('me/feed', 'post', { message: body }, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}
		console.log('Post Id: ' + res.id);
	});
	
	setTimeout(() => {
		createPost();
	}, postFrequency * 1000);
}

createPost();