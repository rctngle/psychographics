const moment = require('moment');

const displayRate = 500;
const displayTime = 10000;

const newsPool = [];

function getNews(since) {
	return new Promise((resolve, reject) => { 
		fetch('http://localhost:3000/?since='+since, {
			method: 'get'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			resolve(data);
		});
	});
}

function checkNews(since) {
	getNews(since).then((data) => {
		data.news.forEach((newsItem) => {
			newsPool.push(newsItem);
		});

		let t;
		if (data.news.length > 0) {
			t = data.news[data.news.length - 1].timestamp;
		} else if (newsPool.length > 0) {
			t = newsPool[newsPool.length -1].timestamp; 
		}

		if (t !== undefined) {
			setTimeout(() => {
				checkNews(t);
			}, 1000);
		}
	});
}

function displayNews() {
	setInterval(() => {
		if (newsPool.length > 0) {
			const item = newsPool.shift();
			const el = document.createElement('div');
			el.classList.add('news-item');
			el.innerHTML = `
				<span class="timestamp">${item.date}</span>
				<h1>${item.headline}</h1>
				<h2>${item.topic}</h2>
				<p>${item.blurb}</p>
			`;

			const rect = document.querySelector('main').getBoundingClientRect();
			const buffer = 200;
			const left = Math.floor((Math.random() * (rect.width + buffer)) - buffer / 2);
			const top = Math.floor((Math.random() * (rect.height + buffer)) - buffer / 2);

			el.style.left = left+'px';
			el.style.top = top+'px';
			el.dataset.time = new moment().format('X') * 1000;

			document.querySelector('main').appendChild(el);
		}

	}, displayRate);
}

function updateNews() {
	// requestAnimationFrame(updateNews);
	
	setInterval(() => {
		document.querySelectorAll('.news-item').forEach((newsItem) => {
			const now = (new moment().format('X') * 1000) + new Date().getMilliseconds();
			const time = parseInt(newsItem.dataset.time);
			const p = (now - time) / displayTime;

			if (p > 1) {
				newsItem.parentNode.removeChild(newsItem);
			}
			
		});
	}, 100);
	
}

checkNews(0);
displayNews();
requestAnimationFrame(updateNews);
