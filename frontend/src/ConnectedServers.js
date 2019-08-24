import React from 'react'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'

import './main.scss' // webpack must be configured to do this

export default class ConnectedServers extends React.Component {

	render() {
		return (
			<div>
				<h1>Connected Servers</h1>
				<strong>Players with events this week</strong>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Characters</h2>
						<ul>
							<li><input type="checkbox" /> Server 1</li>
							<li><input type="checkbox" /> Server 2</li>
							<li><input type="checkbox" /> Server 3</li>
							<li><input type="checkbox" checked /> Server 4</li>
							<li><input type="checkbox" /> Server 5</li>
						</ul>
					</div>

					<div style={{ "width": "50%" }}>
						<FullCalendar 
						defaultView="listWeek" 
						plugins={[listPlugin]}
						events={[
								{ title: 'Janice - Mjorln eats', date: '2019-08-22' },
								{ title: 'Craig - Jinks buys a car', date: '2019-08-24' }
							]}
						/>
						<ul style={{"display":"flex"}}>
							<li>
								Janice<br />
								Characters
								<ul>
									<li>Xargothrax</li>
									<li>Mjorln</li>
								</ul>
							</li>
							<li>
								Craig<br />
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
