fetch('/data/friends.json', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then((data) => {
	let years = {};
	data.forEach((type) => {		
		type.friends.forEach((friend) => {
			const dateAdded = new Date(parseInt(friend.timestamp) * 1000);		
			const yearAdded = dateAdded.getFullYear();
			if(years[yearAdded] === undefined){
				years[yearAdded] = {};				
			}
			if(years[yearAdded][type.groupd] === undefined){
				years[yearAdded][type.groupd] = [];
			}
			years[yearAdded][type.groupd].push(friend);	
		});
	});
	appendFriends(years);
});


function appendFriends(years){
	for (var yearName in years) {
		const year = years[yearName];		
		let yearColumn = document.createElement('div');
		yearColumn.classList.add('column');
		let title = document.createElement('h1');
		title.textContent = yearName;
		yearColumn.appendChild(title);
		for(var type in year){
			let typeTitle = document.createElement('h2');
			typeTitle.textContent = type;
			yearColumn.append(typeTitle);
			for(var friend in year[type]){
				let name = document.createElement('div');
				name.textContent = year[type][friend].name;
				yearColumn.appendChild(name);				
			}
		}	
		document.body.appendChild(yearColumn);
	}
}