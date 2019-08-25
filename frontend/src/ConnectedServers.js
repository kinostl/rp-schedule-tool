import React from 'react'

import Calendar from './Calendar';

export default class ConnectedServers extends React.Component {
	constructor() {
		super()
		this.state = {
			"servers": {
				"Server 1": true,
				"Server 2": false,
				"Server 3": false,
				"Server 4": false,
				"Server 5": false,
			},
			"selected_player": null,
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

	render() {
		let checkBoxes = []
		let characters = []
		for (const key in this.state.servers) {
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
							events={[
								{ title: 'Janice - Mjorln eats', date: '2019-08-22' , extendedProps:{
									"player":"Janice"
								}},
								{ title: 'Craig - Jinks buys a car', date: '2019-08-24' , extendedProps : {
									"player":"Craig"
								}}
							]}
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
