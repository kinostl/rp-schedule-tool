import React from 'react'
import Calendar from './Calendar';

export default class MyAvailability extends React.Component {

	render() {
		return (
			<div>
				<h1>Set Availability</h1>
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
					<Calendar
						view="timeGridWeek"
						slotDuration="00:15:00"
						selectable={true}
						events={[
							{ title: 'event 1', date: '2019-08-23' },
							{ title: 'event 2', date: '2019-08-25' }
						]}/>
				</div>
			</div>
			</div>
		)
	}

}
