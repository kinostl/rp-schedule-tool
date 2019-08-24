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

	render() {
		return (
			<div>
				<h1>Set Availability</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div style={{ "width": "25%" }}>
						<h2>My Servers</h2>
						<ul style={{"listStyle":"none"}}>
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
							<button className="btn btn-success" onClick={() => {
								let calApi = this.calRef.current.getApi()
								let events = calApi.getEvents()
								let newEvent = this.state.selected_range
								let makeNewEvent = true
								for(let event of events){
									let startsInEvent = ((newEvent.start >= event.start) && (newEvent.start <= event.end))
									let endsInEvent = ((newEvent.end >= event.start) && (newEvent.end <= event.end))
									let eventInNewEvent = ((newEvent.start <= event.start) && (newEvent.end >= event.end))
									console.table({
										"startsInEvent":startsInEvent,
										"endsInEvents":endsInEvent,
										"eventInNewEvent":eventInNewEvent
									})
									if(event.allDay === false){
										if(startsInEvent){
											makeNewEvent=false
											event.setEnd(newEvent.end)
										}
										if(endsInEvent){
											makeNewEvent=false
											event.setStart(newEvent.start)
										}
										if(eventInNewEvent){
											event.remove()
										}
									}
								}
								if(makeNewEvent){
									calApi.addEvent(this.state.selected_range)
								}
							}}>
								Available
							</button>
							<button className="btn btn-danger">
								Unavailable
							</button>
							<button className="btn btn-primary" onClick={() => {
								let calApi = this.calRef.current.getApi()
								let events = calApi.getEvents()
								console.log(events)
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
