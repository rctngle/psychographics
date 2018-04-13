import AppDispatcher from '../dispatchers/app-dispatcher';
import Constants from '../constants/constants';

module.exports = {
	fetchData: function(options) {
		AppDispatcher.dispatch({
			actionType: Constants.APP_FETCH_DATA,
			options: options,
		});
	},
	post: function(template) {
		AppDispatcher.dispatch({
			actionType: Constants.APP_POST,
			template: template,
		});
	},
	fetchNumPosts: function() {
		AppDispatcher.dispatch({
			actionType: Constants.APP_FETCH_NUM_POSTS,
		});
	},
};