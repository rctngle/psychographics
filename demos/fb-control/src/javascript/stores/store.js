import AppDispatcher from '../dispatchers/app-dispatcher';
import EventEmitter from 'events';
import assign from 'object-assign';
import _ from 'underscore';

import Config from '../config/config';
import Constants from '../constants/constants';

const CHANGE_EVENT = 'change';

let _data;

let _products = {
	'cereal': ['Cheerios®', 'Chocapic®', 'Fitness®', 'Lion® Cereal', 'Crunch®', 'Nesquik® Breakfast Cereal'],
	'chocolate, confectionery and baked goods': ['After Eight®', 'Butterfinger®', 'Milkybar®', 'Kit Kat®', 'Lion®', 'Baci Perugina®', 'Smarties®', 'SweeTARTS®', 'Hershey'],
	'coffee': ['Blue Bottle Coffee Company®', 'Nescafé®', 'Nespresso®' ],
	'frozen food': ['Buitoni®', 'Hot Pockets®', 'Stouffer’s®'],
	'water': ['Acqua Panna', 'Arrowhead Water', 'Poland Spring', 'San Pellegrino', 'Perrier®'],
	'billion-euro brand': ['Dove®', 'Hellmann’s and Best Foods®', 'Axe®/Lynx®', 'Lipton®', 'Knorr®', 'Lux®'],
	'food and beverage': ['Ben & Jerry’s®', 'I Can’t Believe It’s Not Butter®', 'Knorr®', 'Lipton®', 'Lipton Ice Tea®', 'Maille®', 'Maizena®', 'Pfanni®', 'Popsicle®'],
	'haircare': ['Aussie®', 'Herbal Essences®', 'Head & Shoulders®', 'Pantene®', 'Wash & Go®'],
	'healthcare product': ['Crest®', 'Scope®', 'Metamucil®', 'Vicks®', 'Swisse®'],
	'home and personal care brand': ['Axe/Lynx®', 'Badedas®', 'Cif®', 'Clear®', 'Coccolino®', 'Dove®', 'Impulse®', 'Lux®', 'Mentadent®', 'Omo®', 'Persil®', 'Rexona®', 'Robijn®', 'Surf®', 'Sunsilk®', 'Toni & Guy®', 'Vaseline®', 'Zendium®'],
	'household': ['Fairy®', 'Febreze®', 'Joy®', 'Mr. Clean®', 'Puffs®', 'Vial®', 'Swiffer®'],
	'laundry detergents': ['Ariel®', 'Bold®', 'Cheer®', 'Dreft®', 'Tide®'],
	'menstrual hygiene': ['Always®', 'Tampax®'],
	'more than US$1 billion annually': ['Always®', 'Ariel®', 'Bounty Paper Towels®', 'Febreze®', 'Gillette®', 'Head & Shoulders®', 'Olay®', 'Oral-B®', 'Pampers®', 'Pantene®', 'Vicks®'],
	'skin care': ['Ivory®', 'Olay®', 'Old Spice®'],
	'top global brand': ['Pepsi®', 'Lay’s®', 'Mountain Dew®', 'Gatorade®', 'Tropicana®', '7UP®', 'Doritos®', 'Quaker® Oats ', 'Cheetos®', 'Lipton®', 'Fritos®', 'Frappuccino® Blended Beverages', 'Walkers®'],
};

let _posts = [];
let _numPosts = 0;

const Store = assign({}, EventEmitter.prototype, {
	
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getData: function() {
		return _data;
	},
	
	getProducts: function() {
		return _products;
	},

	getPosts: function() {
		return _posts;
	},

	getNumPosts: function() {
		return _numPosts;
	},
});

function fetchData() {
	return new Promise((resolve, reject) => {

		_data = { foo: 1 };
		resolve(true);
	});
}

function post(template) {
	return new Promise((resolve, reject) => {
		const post = template.join(' ');
		_posts.unshift(post);
		_posts = _posts.slice(0, 10);	
		_numPosts++;

		fetch(Config.api()+'/post', {
			method: 'post',
			headers: {
			'content-type': 'application/json'
			},
			body: JSON.stringify({ post: post }),
		}).then((response) => {
			return response.json();
		}).then(function(data) {
			resolve(true);
		}).catch((err) => {
			reject(err);
		});
	});	
}


function fetchNumPosts() {
	return new Promise((resolve, reject) => {
		fetch(Config.api()+'/num-posts', {
			method: 'get',
		}).then((response) => {
			return response.json();
		}).then(function(data) {
			_numPosts = data.numPosts;
			resolve(true);
		}).catch((err) => {
			reject(err);
		});
	});	
}

AppDispatcher.register((action) => {
	switch(action.actionType) {

	case Constants.APP_FETCH_DATA:
		fetchData(action.section).then((response) => {
			Store.emitChange();
		}, (response) => {
			console.error('Failed!', response.statusMessage);
			Store.emitChange();
		});
		break;
	case Constants.APP_POST:
		post(action.template).then((response) => {
			Store.emitChange();
		}, (response) => {
			console.error('Failed!', response.statusMessage);
			Store.emitChange();
		});
		break;
	case Constants.APP_FETCH_NUM_POSTS:
		fetchNumPosts().then((response) => {
			Store.emitChange();
		}, (response) => {
			console.error('Failed!', response.statusMessage);
			Store.emitChange();
		});
		break;
	default:
	}
});

module.exports = Store;