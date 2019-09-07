import React from 'react'
import NewMyCharacters from './components/MyCharacters/new';
import EditMyCharacters from './components/MyCharacters/edit';

export default class MyCharacters extends React.Component {
	constructor(){
		super()
		this.state={
			"loading":true,
			"editCharacter": null,
			"characters":[]
		}
	}

	componentDidMount(){
		this.refreshCharacters()
	}

	refreshCharacters = () => {
		this.props.api.get('/characters')
		.then((res)=>{
			this.setState({
				"loading":false,
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
			<div style={{"display":"flex", "justifyContent":"space-around"}}>
				<div>
					<ul style={{"listStyle":"none"}}>
						<li><button class="btn btn-link" onClick={()=>{this.clearEditCharacter()}}>Add New Character</button></li>
						{this.state.characters.map((character, charId)=>(
							<li key={character.id}><button class="btn btn-link" onClick={()=>{this.setEditCharacter(charId)}}>{character.name}</button></li>
						))}
					</ul>
				</div>

				<div style={{"width":"50%"}}>
					{
						this.state.editCharacter?
						<EditMyCharacters servers={this.props.user.servers} api={this.props.api} character={this.state.editCharacter} onEdit={this.refreshCharacters} onDelete={this.handleDelete}/>
						:<NewMyCharacters servers={this.props.user.servers} api={this.props.api} onCreate={this.refreshCharacters}/>
					}
				</div>
			</div>
			</div>
		)
	}

}
