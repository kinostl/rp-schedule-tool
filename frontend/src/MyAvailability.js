import React from 'react'
import Calendar from './Calendar'

export default class MyAvailability extends React.Component {
	constructor() {
		super()
		this.state = {
			"selected_range": null,
			"events": [
				{ date: '2019-08-23' },
				{ date: '2019-08-25' }
			]
		}
	}

	render() {
		return (
			<div>
				<h1>Set Availability</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Servers</h2>
						<ul>
							<li><input type="checkbox" />Select All</li>
							<li><input type="checkbox" /> Server 1</li>
							<li><input type="checkbox" /> Server 2</li>
							<li><input type="checkbox" /> Server 3</li>
							<li><input type="checkbox" checked /> Server 4</li>
							<li><input type="checkbox" /> Server 5</li>
						</ul>
					</div>
					<div style={{ "width": "50%" }}>
						{this.state.selected_range ?
							(<div className="form-group" style={{ "textAlign": "center" }}>
								{this.state.selected_range.startStr} to {this.state.selected_range.endStr}
							</div>)
							: (<div className="form-group">&nbsp;</div>)
						}
						<div className="form-group" style={{ "display": "flex", "justifyContent": "space-around" }}>
							<button className="btn btn-success" onClick={(e) => {
								this.setState({
									"events":this.state.events.concat(this.state.selected_range)
								})
							}}>Available</button>
							<button className="btn btn-danger">Unavailable</button>
						</div>
						<Calendar
							defaultView="timeGridWeek"
							selectable={true}
							select={(selectInfo) => {
								this.setState({
									"selected_range": selectInfo
								})
							}}
							events={this.state.events} />
					</div>
				</div>
			</div>
		)
	}

}
