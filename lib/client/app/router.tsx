import 'core-js/stable'
import 'regenerator-runtime/runtime'

import {h, render, VNode} from 'preact'
import Router from 'preact-router'

// Local Imports
import Layout from './Layout'
import Home from './pages/Home'

// quick fix as support for preact and parcel is iffy
window.h = h

const App = (): VNode => (
	<Layout>
		<Router>
			<Home path="/" />
		</Router>
	</Layout>
)

// fetch entrypoint and render
const entry: HTMLElement | null = document.getElementById('react-root')
if (entry) render(<App />, entry)

// register a SW based on
