

fetch('../../data/friends.json', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then((data) => {
	let years = [];
	data.forEach((friend) => {
		const dateAdded = new Date(parseInt(friend.timestamp) * 1000);		
		const yearAdded = dateAdded.getFullYear();
		if(years[yearAdded] === undefined){
			years[yearAdded] = [];
		}
		years[yearAdded].push(friend);	
	});
	appendFriends(years);
});


function appendFriends(years){
	years.forEach(function(year, yearName){
		let yearColumn = document.createElement('div');
		yearColumn.classList.add('column');
		let title = document.createElement('h1');
		title.textContent = yearName;
		yearColumn.appendChild(title);
		year.forEach(function(friend){
			let name = document.createElement('div');
			name.textContent = friend.name;
			yearColumn.appendChild(name);
		});
		document.body.appendChild(yearColumn);

	});
}

