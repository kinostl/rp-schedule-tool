import React from 'react'

import Calendar from './Calendar';

export default class ConnectedServers extends React.Component {
	constructor() {
		super()
		this.state = {
			"servers": {},
			"server_names":{},
			"selected_player": null,
			"loading":true,
			"events": [
				{
					title: 'Janice - Mjorln eats', date: '2019-08-22', extendedProps: {
						"player": "Janice"
					}
				},
				{
					title: 'Craig - Jinks buys a car', date: '2019-08-24', extendedProps: {
						"player": "Craig"
					}
				}
			],
			"players": {
				"Janice": [
					"Xargothrax",
					"Mjorln"
				],
				"Craig": [
					"Ttttts",
					"Jinks"
				]
			}
		}
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
				"servers":servers,
				"server_names":server_names
			})

		})
	}

	render() {
		let checkBoxes = []
		let characters = []
		for (const key in this.state.servers) {
			const val = this.state.servers[key]
			const name = this.state.server_names[key]

			checkBoxes.push(<li key={key}>
				<input checked={val} onChange={(e) => {
					this.setState({
						"servers": {
							...this.state.servers,
							[key]: e.target.checked
						}
					},()=>{
							let filterId = 1
							let params = {}
							for (let [key, value] of Object.entries(this.state.servers)) {
								if (value) {
									params[`filter${filterId}`] = `ServerId,eq,${key}`
									filterId = filterId + 1
								}
							}
							this.props.api.get('/events', { params: params }).then((res) => {
								let events = res.data['records']
								let nameString = events.map((event)=>event.UserId).concat(events.map((event)=>event.ServerId)).join(",")
								return this.props.api.get(`/names/${nameString}`).then((names)=>{
									let temp_names = names.data
									names={}
									for(const name of temp_names){
										names[name['id']]=name['name']
									}
									events = events.map((event) => ({
										start: event.start * 1000,
										end: event.end * 1000,
										title: `${names[event.ServerId]} hosted by ${names[event.UserId]}`
									}))
									this.setState({
										"events": events
									})
								})
							})
					})
				}} type="checkbox" /> {name}
			</li>)
		}

		if (this.state.selected_player) {
			for (const key in this.state.players[this.state.selected_player]) {
				let character = this.state.players[this.state.selected_player][key]
				characters.push((<li>{character}</li>))
			}
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
							eventClick={(e)=>{
								this.setState({"selected_player":e.event.extendedProps.player})
							}}
							events={this.state.events}
						/>
					</div>
					<div>
						{
							this.state.selected_player ? (
								<div>
									<span>{this.state.selected_player}</span>
									<hr/>
									<span>Characters</span>
									<ul>
										{characters}
									</ul>
								</div>
							) : <span>No event selected</span>
						}
					</div>
				</div>
			</div>
		)
	}

}
