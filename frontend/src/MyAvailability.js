import React from 'react'
import Calendar from './Calendar'
import api from './api'

export default class MyAvailability extends React.Component {
	constructor() {
		super()
		this.state = {
			"selected_range": null,
			"servers":{
				"1":true,
				"2":false,
				"3":false,
				"4":false,
				"5":false,
			},
			"server_names":{
				"1":"Server 1",
				"2":"Server 2",
				"3":"Server 3",
				"4":"Server 4",
				"5":"Server 5",
			}
		}
		this.calRef = React.createRef()
	}

	getConflicts = (newEvent, event) => {
		let startsInEvent = ((newEvent.start >= event.start) && (newEvent.start <= event.end))
		let endsInEvent = ((newEvent.end >= event.start) && (newEvent.end <= event.end))
		let eventInNewEvent = ((newEvent.start <= event.start) && (newEvent.end >= event.end))
		return [startsInEvent, endsInEvent, eventInNewEvent]
	}

	handleConflict = (event, newEvent, eventInNewEvent, startsInEvent, endsInEvent, remove) => {
		let makeNewEvent = true
		if (eventInNewEvent) {
				if(!remove){
					makeNewEvent = false
					event.setEnd(newEvent.end)
					event.setStart(newEvent.start)
				}else{
					event.remove()
				}
		}
		else {
			if (startsInEvent) {
				if (!remove) {
					makeNewEvent = false
					event.setEnd(newEvent.end)
				} else {
					event.setEnd(newEvent.start)
				}
			}
			if (endsInEvent) {
				if (!remove) {
					makeNewEvent = false
					event.setStart(newEvent.start)
				} else {
					event.setStart(newEvent.end)
				}
			}
		}
		if(remove){
			return false
		}
		return makeNewEvent
	}

	handleEvent = (newEvent,remove) => {
		let calApi = this.calRef.current.getApi()
		let events = calApi.getEvents()
		let makeNewEvent = {}
		if (!newEvent.extendedProps) {
			for (const key in this.state.servers) {
				makeNewEvent[key] = true
			}
		}
		for (const event of events) {
			if (event.allDay === false) {
				let [startsInEvent, endsInEvent, eventInNewEvent] = this.getConflicts(newEvent, event)
				if (newEvent.extendedProps) {
					if(newEvent.extendedProps.server === event.extendedProps.server){
						this.handleConflict(event, newEvent, eventInNewEvent, startsInEvent, endsInEvent, remove)
					}
				}else{
					for (const key in this.state.servers) {
						const val = this.state.servers[key]
						if (val) {
							if(event.extendedProps.server === key){
								makeNewEvent[key] = this.handleConflict(event, newEvent, eventInNewEvent, startsInEvent, endsInEvent, remove)
							}
						}
					}
				}
			}
		}

		if(!remove){
			for (const key in this.state.servers) {
				const val = this.state.servers[key]
				if (val && makeNewEvent[key]) {
					let createdEvent = calApi.addEvent(newEvent)
					createdEvent.setProp("title", this.state.server_names[key])
					createdEvent.setExtendedProp("ServerId", key)
				}
			}
		}
		this.setState({"selected_range":null})
	}

	handleRemove = () => {
		if(this.state.selected_range){
			this.handleEvent(this.state.selected_range, true)
		}
	}

	handleResize = (info) => {
		this.handleEvent(info.event)
	}

	handleDrop = (info) => {
		this.handleEvent(info.event)
	}

	handleAdd = () => {
		if(this.state.selected_range){
			this.handleEvent(this.state.selected_range)
		}
	}

	render() {
		let checkBoxes = []
		for(const key in this.state.servers){
			const val = this.state.servers[key]
			checkBoxes.push(<li key={key}>
				<input checked={val} onChange={(e) => {
					this.setState({
						"servers": {
							...this.state.servers,
							[key]: e.target.checked
						}
					})
				}} type="checkbox" /> {key}
			</li>)
		}
		return (
			<div>
				<h1>Set Availability</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Servers</h2>
						<ul style={{ "listStyle": "none" }}>
							<li><input type="checkbox" /> Select All</li>
							{checkBoxes}
						</ul>
					</div>
					<div style={{ "width": "50%" }}>
						<div className="form-group" style={{ "display": "flex", "justifyContent": "space-around" }}>
							<button className="btn btn-success" onClick={this.handleAdd}>Available</button>
							<button className="btn btn-danger" onClick={this.handleRemove}>Unavailable</button>
							<button className="btn btn-primary" onClick={() => {
								let calApi = this.calRef.current.getApi()
								let events = calApi.getEvents()
								console.log("events",events)
								api.post('/events', {
									...events
								}).then((res) => {
									console.log(res)
								})
							}}>
								Save
							</button>
						</div>
						<Calendar
							ref={this.calRef}
							defaultView="timeGridWeek"
							selectable={true}
							editable={true}
							allDaySlot={false}
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
