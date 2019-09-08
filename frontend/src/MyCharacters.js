import React from 'react'
import axios from 'axios'
import NewMyCharacters from './components/MyCharacters/new';
import EditMyCharacters from './components/MyCharacters/edit';

export default class MyCharacters extends React.Component {
	constructor(){
		super()
		this.state={
			"loading":true,
			"editCharacter": null,
			"characters":[],
			"servers":[]
		}
	}

	componentDidMount(){
		axios.all([
			this.props.api.get('/characters'),
			this.props.api.get('/servers')
		]).then(axios.spread((characters, servers)=>{
			this.setState({
				"loading":false,
				"characters":characters.data['records'],
				"servers":servers.data['records']
			})
		}))
	}

	refreshCharacters = () => {
		this.props.api.get('/characters')
		.then((res)=>{
			this.setState({
				"characters":res.data['records']
			})
		})
	}

	handleDelete = () => {
		this.refreshCharacters()
		this.clearEditCharacter()
	}

	clearEditCharacter = () => {
		this.setState({
			"editCharacter":null
		})
	}

	setEditCharacter = (characterId) => {
		let character = this.state.characters[characterId]
		this.setState({
			"editCharacter": character
		})
	}

	render() {
		if(this.state.loading){
			return <div>Loading</div>
		}
		return (
			<div>
				<h1>My Characters</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div className="list-group">
						<button className={
							this.state.editCharacter ?
								"list-group-item list-group-item-action" :
								"list-group-item list-group-item-action active"
						} onClick={() => { this.clearEditCharacter() }}>Add New Character</button>
						{this.state.characters.map((character, charId) => (
							<button className={
								this.state.editCharacter === character ?
									"list-group-item list-group-item-action active" :
									"list-group-item list-group-item-action"
							} key={character.id} onClick={() => { this.setEditCharacter(charId) }}>{character.name}</button>
						))}
					</div>

					<div style={{ "width": "50%" }}>
						{
							this.state.editCharacter ?
								<EditMyCharacters servers={this.state.servers} api={this.props.api} character={this.state.editCharacter} onEdit={this.refreshCharacters} onDelete={this.handleDelete} />
								: <NewMyCharacters servers={this.state.servers} api={this.props.api} onCreate={this.refreshCharacters} />
						}
					</div>
				</div>
			</div>
		)
	}

}
