let messages;

fetch('/data/security.json', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then((data) => {
	const sessions = _.findWhere(data, { name: 'Account activity'});
	createSVG();
	sessions.entries.forEach(function(session){
		session.meta.date = moment(parseInt(session.meta.timestamp), 'X').format('YYYY-MM-DD');
	})
	buildGraph(sessions.entries);
	

});

var color = d3.scaleLinear().domain([1, 30]).range([0.3, 1]);

function buildGraph(f){	
	var data = d3.nest()
		.key(function(d) { 
			return d.meta.date; 
		})
		.object(f);

		rect.filter(function(d) { 
			var tokens = d.match(/\,([^at]*)/);
			return d in data;
		})
		.attr('fill', function(d) {
			return 'rgba(255, 0, 0, '+(color(data[d].length))+')';
		})	
}

var width = 960,
	height = 136,
	cellSize = 17;

var rect;

function createSVG(){
	var svg = d3.select('body')
		.selectAll('svg')
		.data(d3.range(2015, 2019))
		.enter().append('svg')
			.attr('width', width)
			.attr('height', height)
		.append('g')
			.attr('transform', 'translate(' + ((width - cellSize * 53) / 2) + ',' + (height - cellSize * 7 - 1) + ')');

	svg.append('text')
			.attr('transform', 'translate(-6,' + cellSize * 3.5 + ')rotate(-90)')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10)
			.attr('text-anchor', 'middle')
			.text(function(d) { return d; });

	rect = svg.append('g')
			.attr('fill', 'none')
			.attr('stroke', '#ccc')
		.selectAll('rect')
		.data(function(d) { 
			return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append('rect')
			.attr('width', cellSize)
			.attr('height', cellSize)
			.attr('x', function(d) { 
				return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; 

			})
			.attr('y', function(d) { return d.getDay() * cellSize; })
			.datum(d3.timeFormat('%Y-%m-%d'));

	svg.append('g')
			.attr('fill', 'none')
			.attr('stroke', '#000')
		.selectAll('path')
		.data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append('path')
			.attr('d', pathMonth);
}

function pathMonth(t0) {
	var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
		d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
		d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
	return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize
		+ 'H' + w0 * cellSize + 'V' + 7 * cellSize
		+ 'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize
		+ 'H' + (w1 + 1) * cellSize + 'V' + 0
		+ 'H' + (w0 + 1) * cellSize + 'Z';
}
