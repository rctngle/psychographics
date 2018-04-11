// https://developers.facebook.com/tools/accesstoken/
// https://developers.facebook.com/tools/explorer

const postFrequency = 1; // seconds

function getPostMessage(product, category) {
	const templates = [
		`OMG! ${product} is my favority ${category} of all time`,
		`If you like ${category} you'll love ${product}!`,
	];
	return templates[Math.floor(Math.random() * templates.length)];
}


const FB = require('fb');
const fs = require('fs');
const EOL = require('os').EOL;

const userToken = "";
const appToken = "";
const accessToken = "";

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