import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';

import './main.scss' // webpack must be configured to do this

export default class MySchedule extends React.Component {

	constructor() {
		super()
		this.state = {
			"calendarView": "dayGridMonth"
		}
		this.calendarRef = React.createRef()
	}

	render() {
		return (
			<div>
				<h1>My Schedule</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Servers</h2>
						<ul>
							<li><input type="checkbox" /> Server 1</li>
							<li><input type="checkbox" /> Server 2</li>
							<li><input type="checkbox" /> Server 3</li>
							<li><input type="checkbox" checked /> Server 4</li>
							<li><input type="checkbox" /> Server 5</li>
						</ul>
					</div>
					<div style={{ "width": "50%" }}>
						<select value={this.state.calendarView} onChange={(e) => {
							let newView = e.target.value
							let calendarApi = this.calendarRef.current.getApi()
							calendarApi.changeView(newView)
							this.setState({ "calendarView": newView })
						}}>
							<option value="dayGridMonth">Monthly</option>
							<option value="timeGridWeek">Weekly</option>
							<option value="timeGrid">Daily</option>
						</select>
						<FullCalendar
							ref={this.calendarRef}
							defaultView="dayGridMonth"
							nowIndicator={true}
							plugins={[
								dayGridPlugin,
								timeGridPlugin,
							]}
							events={[
								{ title: 'event 1', date: '2019-08-24' },
								{ title: 'event 2', date: '2019-08-26' }
							]}
						/>
					</div>
				</div>
			</div>
		)
	}

}
