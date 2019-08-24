import React from 'react'
import Calendar from './Calendar'

export default class MyAvailability extends React.Component {
	constructor() {
		super()
		this.state = {
			"selected_range": null,
		}
		this.calRef = React.createRef()
	}

	getConflicts = (newEvent, event) => {
		let startsInEvent = ((newEvent.start >= event.start) && (newEvent.start <= event.end))
		let endsInEvent = ((newEvent.end >= event.start) && (newEvent.end <= event.end))
		let eventInNewEvent = ((newEvent.start <= event.start) && (newEvent.end >= event.end))
		return [startsInEvent, endsInEvent, eventInNewEvent]
	}

	addEvent = (newEvent) => {
		let calApi = this.calRef.current.getApi()
		let events = calApi.getEvents()
		if(!newEvent){
			newEvent = this.state.selected_range
		}
		let makeNewEvent = true
		for (let event of events) {
			let [startsInEvent, endsInEvent, eventInNewEvent] = this.getConflicts(newEvent, event)
			if (event.allDay === false) {
				if (startsInEvent) {
					makeNewEvent = false
					event.setEnd(newEvent.end)
				}
				if (endsInEvent) {
					makeNewEvent = false
					event.setStart(newEvent.start)
				}
				if (eventInNewEvent) {
					event.remove()
				}
			}
		}
		if (makeNewEvent) {
			calApi.addEvent(this.state.selected_range)
		}
	}
	
	removeEvent = () => {
		let calApi = this.calRef.current.getApi()
		let events = calApi.getEvents()
		let newEvent = this.state.selected_range
		for (let event of events) {
			console.log({
				"event":event,
				"newEvent":newEvent
			})
			let [startsInEvent, endsInEvent, eventInNewEvent] = this.getConflicts(newEvent, event)
			if (startsInEvent) {
				event.setEnd(newEvent.start)
			}
			if (endsInEvent) {
				event.setStart(newEvent.end)
			}
			if (eventInNewEvent) {
				event.remove()
			}
		}
	}

	handleResize = (info) => {
		this.addEvent(info.event)
	}

	handleDrop = (info) => {
		this.addEvent(info.event)
	}

	render() {
		return (
			<div>
				<h1>Set Availability</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Servers</h2>
						<ul style={{ "listStyle": "none" }}>
							<li><input type="checkbox" /> Select All</li>
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
							<button className="btn btn-success" onClick={this.addEvent}>Available</button>
							<button className="btn btn-danger" onClick={this.removeEvent}>Unavailable</button>
							<button className="btn btn-primary" onClick={() => {
								let calApi = this.calRef.current.getApi()
								let events = calApi.getEvents()
							}}>
								Save
							</button>
						</div>
						<Calendar
							ref={this.calRef}
							defaultView="timeGridWeek"
							selectable={true}
							editable={true}
							select={(selectInfo) => {
								this.setState({
									"selected_range": selectInfo
								})
							}}
							eventResize={this.handleResize}
							eventDrop={this.handleDrop}
							events={[
								{ date: '2019-08-23' },
								{ date: '2019-08-25' }
							]} />
					</div>
				</div>
			</div>
		)
	}

}
