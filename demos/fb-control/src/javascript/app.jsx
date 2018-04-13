import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route  } from 'react-router-dom';
import moment from 'moment';

import Store from './stores/store';
import Actions from './actions/actions';


class Randomizer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			product: undefined,
			category: undefined,
			posting: false,
		};
		this.getTemplate = this.getTemplate.bind(this);
		this.randomize = this.randomize.bind(this);
		this.startRandomize = this.startRandomize.bind(this);
	}

	componentDidMount() {
		this.startRandomize();
	}

	startRandomize() {
		let interval = setInterval(() => {
			if (this.props.products !== undefined) {
				this.randomize();	
			}
		}, 100);

		this.setState({
			interval: interval,
			posting: false,
		});

		const postSeconds = 10;
		const displaySeconds = 5;

		const postDelay = ((postSeconds / 2) + (Math.random() * (postSeconds / 2))) * 1000;
		setTimeout(() => {
			
			clearInterval(this.state.interval);
			this.setState({
				posting: true
			});

			Actions.post(this.state.template);
			setTimeout(() => {
				this.startRandomize();
			}, displaySeconds*1000);
		}, postDelay);
	}	

	randomize() {
		const categories = Object.keys(this.props.products);
		const category = categories[Math.floor(Math.random() * categories.length)];
		const product = this.props.products[category][Math.floor(Math.random() * this.props.products[category].length)];
		this.setState({
			category: category,
			product: product,
			template: this.getTemplate(product, category, this.props.index),
		});
	}

	getTemplate(product, category, index) {
		const templates = [
			['OMG!', product, 'is my favorite', category, 'of all time'],
			['If you like', category, 'you’ll love', product, '!!!'],
			['I wish I had some', product, 'absolutely the best', category, 'ever'],
			['Whenever i want', category, 'I always choose', product, 'its the best!'],
			['MMMMmm', product, category, 'SO', 'GOOD'],
		];

		return templates[index];
	}

	render() {

		const cells = [];
		if (this.state.template !== undefined) {
			this.state.template.forEach((token, i) => {
				cells.push(<div key={`cell_${this.props.index}_${i}`} className="cell">{token}</div>);
			});
		}

		const classes = ['randomizer'];
		if (this.state.posting) {
			classes.push('posting');
		}
		return (
			<div className={classes.join(' ')}>
				{cells}
			</div>
		);
	}
}

class PostsList extends React.Component {
	render() {
		const listItems = [];
		if (this.props.posts) {
			this.props.posts.forEach((post, i) => {
				listItems.push(<li key={'post_' + i}>{post}</li>);
			});
		}
		return (
			<ul>{listItems}</ul>
		);
	}
}

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.setTime = this.setTime.bind(this);
	}

	componentDidMount() {
		this.setState({
			startMoment: new moment(),
			runningTime: 0,
		});

		this.setTime();

		setInterval(() => {
			this.setTime();
		}, 50);
	}

	setTime() {
		const currentMoment = new moment();
		const diff = currentMoment.diff(this.state.startMoment);

		const hours = Math.floor( diff / (1000*60*60) );
		const mins  = Math.floor( diff / (1000*60) );
		const secs  = ( diff / 1000 ).toFixed(2);
		this.setState({
			currentTime: currentMoment.format('hh:mm:ss:SS'),
			runningTime: `${hours}:${mins}:${secs}`,
		});
	}

	render() {
		return (
			<div id="container">
				<header>
					<div id="num-posts" className="header-col">
						#{this.props.numPosts} posts generated
					</div>
					<div id="current-time" className="header-col">
						{this.state.currentTime}
					</div>
					<div id="running-time" className="header-col">
						{this.state.runningTime}
					</div>
					<div id="user-name" className="header-col">
						Corinna
					</div>
				</header>
				
				<main>
					<section id="randomizers">
						<Randomizer products={this.props.products} index={0} />
						<Randomizer products={this.props.products} index={1} />
						<Randomizer products={this.props.products} index={2} />
						<Randomizer products={this.props.products} index={3} />
						<Randomizer products={this.props.products} index={4} />
					</section>

					<section id="posts">
						<PostsList posts={this.props.posts} />
					</section>
				</main>
			</div>
		);
	}
}


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		Store.addChangeListener(this.handleChange);
		Actions.fetchData();
		Actions.fetchNumPosts();

		this.setState({
			products: Store.getProducts(),
		});
	}

	componentWillUnMount() {
		Store.removeChangeListener(this.handleChange);
	}

	handleChange() {
		let data = Store.getData();
		this.setState({
			posts: Store.getPosts(),
			numPosts: Store.getNumPosts(),
		});

		console.log(this.state);
	}

	render() {
		return (
			<Route
				exact path="/"
				render={(routeProps) => (
					<Home products={this.state.products} posts={this.state.posts} numPosts={this.state.numPosts} />
				)}
			/>
		);
	}
}

ReactDOM.render((
	<BrowserRouter>
		<App />
	</BrowserRouter>
), document.getElementById('app'));
