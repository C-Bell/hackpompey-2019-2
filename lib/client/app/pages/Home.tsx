import {h, Component} from 'preact'

interface TimeState {
	time: Date
}

class Home extends Component {
	state: TimeState = {time: new Date()}

	componentDidMount = () => setTimeout(() => this.setState({time: new Date()}), 999)

	render(_: any, state: TimeState) {
		return (
			<div>
				<h1>Home</h1>
				<p>The time is: {state.time.toLocaleString()}</p>
			</div>
		)
	}
}

export default Home
