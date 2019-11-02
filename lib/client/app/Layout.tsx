import {h, VNode} from 'preact'

const Layout = (props): VNode => {
	console.log(props)
	return (
			<div className="container">
				{props.children}
			</div>
	)
}

export default Layout
