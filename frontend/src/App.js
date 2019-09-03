import React from 'react'

import ConnectedServers from './ConnectedServers'
import MyCharacters from './MyCharacters';
import MyStoryIdeas from './MyStoryIdeas';
import MyAvailability from './MyAvailability';

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
			case "MyAvailability":
				displayedSection = (<MyAvailability/>)
				break;
			case "ConnectedServers":
				displayedSection = (<ConnectedServers/>)
				break;
			case "MyCharacters":
				displayedSection = (<MyCharacters user={this.props.user} api={this.props.api}/>)
				break;
			case "MyStoryIdeas":
				displayedSection = (<MyStoryIdeas/>)
				break;
			default:
				displayedSection = (<div>Hi, tester! Go ahead and click around.
					 This is a tool to help you schedule Roleplaying sessions! 
					 You can add your characters, story ideas, and list your available timeslots.<br/>
					 <strong>At the moment, nothing is functional. This is purely display.</strong>
					 </div>)
				break;
		}

		return (
			<div style={{ "width": "75%", "marginLeft": "auto", "marginRight": "auto" }}>
				{
					this.props.user ?
						(<strong>Logout</strong>) :
						(<a href="http://localhost:8080/login">Login</a>)
				}
				<menu style={{ "display": "flex", "justifyContent": "space-around", "listStyle": "none" }}>
					<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'MyAvailability')}>My Availability</button></li>
					<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'ConnectedServers')}>Connected Servers</button></li>
					<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'MyCharacters')}>My Characters</button></li>
					<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'MyStoryIdeas')}>My Story Ideas</button></li>
				</menu>
				{displayedSection}
			</div>
		)
	}

}