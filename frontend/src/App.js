import React from 'react'

import ConnectedServers from './ConnectedServers'
import MyCharacters from './MyCharacters';
import MyStoryIdeas from './MyStoryIdeas';
import MyAvailability from './MyAvailability';

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			"section": ""
		}
		this.setSection = this.setSection.bind(this)
	}

	setSection(e, section) {
		e.preventDefault()
		this.setState({
			"section": section
		})
	}

	render() {
		return (
			<div>
				{
					this.props.user ? (
						<menu style={{ "display": "flex", "justifyContent": "space-around", "listStyle": "none" }}>
							<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'MyAvailability')}>My Availability</button></li>
							<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'ConnectedServers')}>Connected Servers</button></li>
							<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'MyCharacters')}>My Characters</button></li>
							<li><button className="btn btn-secondary" onClick={(e) => this.setSection(e, 'MyStoryIdeas')}>My Story Ideas</button></li>
							<li><button class="btn btn-secondary" onClick={(e) => {
								e.preventDefault()
								window.localStorage.removeItem('token')
								document.location.replace(process.env.REACT_APP_CLIENT_URL)
							}}>Logout</button></li>
						</menu>
					) : null
				}
				<div class="mx-5">
					{
						this.props.user ? ((() => {
							switch (this.state.section) {
								case "MyAvailability":
									return (<MyAvailability api={this.props.api} />)
								case "ConnectedServers":
									return (<ConnectedServers api={this.props.api} />)
								case "MyCharacters":
									return (<MyCharacters api={this.props.api} />)
								case "MyStoryIdeas":
									return (<MyStoryIdeas api={this.props.api} />)
								default:
									return (
										<div class="jumbotron text-center">
											<h1 class="display-4">RP Scheduler</h1>
											<p class="lead">A tool to help you schedule Roleplaying sessions!</p>
											<hr class="my-4" />
											<p>You can add your characters, story ideas, and list your available timeslots.</p>
											<p>All your entries are siloed to individual Discord servers.</p>
											<p>List your availability with My Ability</p>
											<p>See events on your servers with Connected Servers</p>
											<p>List your characters with My Characters</p>
											<p>List your story ideas with My Stories Ideas</p>
											<p>Your Story Ideas and Characters will appear under Connected Servers for all users you share a server with.</p>
										</div>
									)
							}
						})())
							: (<div class="jumbotron mt-5 text-center">
								<h1 class="display-4">RP Scheduler</h1>
								<p class="lead">A tool to help you schedule Roleplaying sessions!</p>
								<hr class="my-4" />
								<p>You can add your characters, story ideas, and list your available timeslots.</p>
								<p>All your entries are siloed to individual Discord servers.</p>
								<button class="btn btn-primary btn-lg" onClick={(e)=>{
									e.preventDefault()
									document.location.replace(`${process.env.REACT_APP_API_URL}/login`)
								}}>Login using Discord!</button>
							</div>)
					}
				</div>
			</div>
		)
	}
}
