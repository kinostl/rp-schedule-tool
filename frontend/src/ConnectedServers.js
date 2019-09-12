import React from 'react'
import ReactMarkdown from 'react-markdown';

import Calendar from './Calendar';

export default class ConnectedServers extends React.Component {
	constructor() {
		super()
		this.state = {
			"servers": {},
			"server_names": {},
			"selected_event": (<span>No event selected</span>),
			"loading": true,
			"loading_events": false,
			"events": [],
		}
	}

	componentDidMount() {
		this.props.api.get('/servers').then((res) => {
			let serverRes = res.data['records']
			let servers = {}
			let server_names = {}
			for (let server of serverRes) {
				servers[server['id']] = false
				server_names[server['id']] = server['name']
			}
			this.setState({
				"loading": false,
				"servers": servers,
				"server_names": server_names
			})

		})
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.loading_events !== this.state.loading_events) {
			let filterId = 1
			let params = {}
			for (let [key, value] of Object.entries(this.state.servers)) {
				if (value) {
					console.log("value", key)
					params[`filter${filterId}`] = `ServerId,eq,${key}`
					filterId = filterId + 1
				}
			}
			if (filterId > 1) {
				this.props.api.get('/events', { params: params }).then((res) => {
					let events = res.data['records']
					if(events.length>0){
						let nameString = events.map((event) => event.UserId).concat(events.map((event) => event.ServerId)).join(",")
						this.props.api.get(`/names/${nameString}`).then((names) => {
							let temp_names = names.data
							names = {}
							for (const name of temp_names) {
								names[name['id']] = name['name']
							}
							events = events.map((event) => ({
								start: event.start * 1000,
								end: event.end * 1000,
								title: `${names[event.ServerId]} with ${names[event.UserId]}`,
								extendedProps: {
									User: names[event.UserId],
									Server: names[event.ServerId],
									ServerId: event.ServerId,
									UserId: event.UserId
								}
							}))
							this.setState({
								"loading_events": false,
								"selected_event": (<span>No event selected</span>),
								"events": events
							})
						})
					} else {
						this.setState({
							"loading_events": false,
							"selected_event": (<span>No event selected</span>),
							"events": []
						})
					}
				})
			} else {
				this.setState({
					"loading_events": false,
					"selected_event": (<span>No event selected</span>),
					"events":[]
				})
			}
		}
	}

	render() {
		let checkBoxes = []
		for (const key in this.state.servers) {
			const val = this.state.servers[key]
			const name = this.state.server_names[key]

			checkBoxes.push(<li key={key}>
				<input checked={val} onChange={(e) => {
					this.setState({
						"servers": {
							...this.state.servers,
							[key]: !this.state.servers[key]
						},
						"loading_events": true,
					})
				}} type="checkbox" /> {name}
			</li>)
		}

		return (
			<div>
				<h1>Connected Servers</h1>
				<strong>Players with events this week</strong>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div>
						<ul style={{ "listStyle": "none" }}>
							{checkBoxes}
						</ul>
					</div>

					<div style={{ "width": "50%" }}>
						<Calendar
							defaultView="listWeek"
							eventClick={(e) => {
								let eventProps = e.event.extendedProps
								this.props.api.get(`/characters?filter=UserId,eq,${eventProps.UserId}&filter=ServerId,eq,${eventProps.ServerId}`).then((characters) => {
									characters = characters.data['records']
									let character_ids = characters.map((character) => character.id)
									let filterId = 1
									let params = {}
									for (let id of character_ids) {
										params[`filter${filterId}`] = `CharacterId,eq,${id}`
										filterId = filterId + 1
									}
									this.props.api.get(`/stories`, { params: params }).then((stories) => {
										stories = stories.data['records']
										let selected_event = [(<strong>{eventProps.User}'s characters and stories on {eventProps.Server}</strong>)]
										for (let character of characters) {
											let character_stories = stories.filter((story) => story.CharacterId === character.id)
											let character_story_rows = []
											for (let character_story of character_stories) {
												character_story_rows.push(
													<li className="list-group-item">
														<strong>{character_story.name}</strong>
														<p><ReactMarkdown source={character_story.description} /></p>
													</li>
												)
											}

											let character_story_list
											if (character_story_rows.length > 0) {
												character_story_list = (<ul className="list-group list-group-flush">
													{character_story_rows}
												</ul>)
											}

											selected_event.push(
												(
													<div className="card mb-3">
														<div className="card-header">{character.name}</div>
														<div className="card-body"><ReactMarkdown source={character.description} /></div>
														{character_story_list}
													</div>
												)
											)
										}

										this.setState({
											selected_event: selected_event
										})
									})
								})
							}}
							events={this.state.events}
						/>
						<div>
							{this.state.selected_event}
						</div>
					</div>
				</div>
			</div>
		)
	}

}
