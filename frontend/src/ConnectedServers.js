import React from 'react'

export default class ConnectedServers extends React.Component {

	render() {
		return (
			<div>
				<h1>Connected Servers</h1>
				<strong>Players with events this week</strong>
				<div style={{"display":"flex", "justifyContent":"space-around"}}>
					<div style={{"width":"25%"}}>
						<h2>My Servers</h2>
						<ul>
							<li><input type="checkbox"/> Server 1</li>
							<li><input type="checkbox"/> Server 2</li>
							<li><input type="checkbox"/> Server 3</li>
							<li><input type="checkbox" checked/> Server 4</li>
							<li><input type="checkbox"/> Server 5</li>
						</ul>
					</div>

					<div style={{"width":"50%"}}>
						<ul>
							<li>
								Janice<br/>
								Characters
								<ul>
									<li>Xargothrax</li>
									<li>Mjorln</li>
								</ul>
							</li>
							<li>
								Craig<br/>
								Characters
								<ul>
									<li>Ttttts</li>
									<li>Jinks</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}

}
