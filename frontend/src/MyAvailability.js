import React from 'react'
import Calendar from './Calendar'

export default class MyAvailability extends React.Component {
	constructor() {
		super()
		this.state = {
			"loading":true,
			"selected_range": null,
			"servers":{},
			"server_names":{}
		}
		this.calRef = React.createRef()
	}

	componentDidMount(){
		this.props.api.get('/servers').then((res)=>{
			let serverRes = res.data['records']
			let servers={}
			let server_names={}
			for(let server of serverRes){
				servers[server['id']]=false
				server_names[server['id']]=server['name']
			}
			this.setState({
				"loading":false,
				"saveStatus":0,
				"servers":servers,
				"server_names":server_names
			})

			return this.props.api.get('/events')
		}).then((res)=>{
			let calApi = this.calRef.current.getApi()
			let events = res.data['records']
			for(const event of events){
				calApi.addEvent({
					start: event.start*1000,
					end: event.end*1000,
					title: this.state.server_names[event.ServerId],
					extendedProps: {
						"ServerId": event.ServerId
					}
				})
			}
		})
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
					if(newEvent.extendedProps.ServerId === event.extendedProps.ServerId){
						this.handleConflict(event, newEvent, eventInNewEvent, startsInEvent, endsInEvent, remove)
					}
				}else{
					for (const key in this.state.servers) {
						const val = this.state.servers[key]
						if (val) {
							if(event.extendedProps.ServerId === key){
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
		if(this.state.loading){
			return <div>Loading</div>
		}

		let checkBoxes = []
		for(const key in this.state.servers){
			const val = this.state.servers[key]
			const name = this.state.server_names[key]
			checkBoxes.push(<li key={key}>
				<input checked={val} onChange={(e) => {
					this.setState({
						"servers": {
							...this.state.servers,
							[key]: e.target.checked
						}
					})
				}} type="checkbox" /> {name}
			</li>)
		}
		return (
			<div>
				<h1>Set Availability</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Servers</h2>
						<ul style={{ "listStyle": "none" }}>
							{checkBoxes}
						</ul>
					</div>
					<div style={{ "width": "50%" }}>
						{
							([
								(<div>&nbsp;</div>),
								(<div>Saving...</div>),
								(<div>Saved</div>)
							])[this.state.saveStatus]
						}
						<div className="form-group" style={{ "display": "flex", "justifyContent": "space-around" }}>
							<button className="btn btn-success" onClick={this.handleAdd}>Available</button>
							<button className="btn btn-danger" onClick={this.handleRemove}>Unavailable</button>
							<button className="btn btn-primary" onClick={() => {
								let calApi = this.calRef.current.getApi()
								let events = calApi.getEvents()
								let getUnix = (timestamp)=>Math.round(timestamp.getTime() / 1000)
								events = events.map((event) => ({
									"start": getUnix(event.start),
									"end": getUnix(event.end),
									"ServerId":event.extendedProps.ServerId
								}))
								this.setState({
									"saveStatus":1
								},()=>{
										this.props.api.post('/events', events).then((res) => {
											this.setState({
												"saveStatus":2
											})
										})
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
						/>
					</div>
				</div>
			</div>
		)
	}

}
