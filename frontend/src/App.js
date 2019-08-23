import React from 'react'

import SetFreeTime from './SetFreeTime'
import MySchedule from './MySchedule'
import ConnectedServers from './ConnectedServers'

export default class App extends React.Component {
	constructor(){
		super()
		this.state={
			"section":""
		}
		this.setSection=this.setSection.bind(this)
	}

	setSection(e,section){
		e.preventDefault()
		this.setState({
			"section":section
		})
	}

	render() {
		let displayedSection
		switch(this.state.section){
			case "SetFreeTime":
				displayedSection = (<SetFreeTime/>)
				break;
			case "ConnectedServers":
				displayedSection = (<ConnectedServers/>)
				break;
			case "MySchedule":
				displayedSection = (<MySchedule/>)
				break;
			default:
				displayedSection = (<div>Hello World</div>)
				break;
		}

		return (
			<div style={{"width":"75%","marginLeft":"auto","marginRight":"auto"}}>
				<menu style={{"display":"flex","justifyContent":"space-around"}}>
					<li><a href="#" onClick={(e)=> this.setSection(e,'SetFreeTime')}>My Availability</a></li>
					<li><a href="#" onClick={(e)=> this.setSection(e,'ConnectedServers')}>Connected Servers</a></li>
					<li><a href="#" onClick={(e)=> this.setSection(e,'MySchedule')}>My Schedule</a></li>
					<li><a href="#">My Characters</a></li>
					<li><a href="#">My Story Ideas</a></li>
				</menu>
				{displayedSection}
			</div>
		)
	}

}
