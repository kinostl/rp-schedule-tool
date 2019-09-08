import React from 'react'
import axios from 'axios'
import NewMyStories from './components/MyStoryIdeas/new'
import EditMyStories from './components/MyStoryIdeas/edit'

export default class MyStoryIdeas extends React.Component {
	constructor(){
		super()
		this.state={
			"loading":true,
			"editStory": null,
			"stories":[],
			"characters":[]
		}
	}

	componentDidMount(){
		axios.all([
			this.props.api.get('/stories'),
			this.props.api.get('/characters')
		]).then(axios.spread((stories, characters)=>{
			this.setState({
				"loading":false,
				"stories":stories.data['records'],
				"characters":characters.data['records'],
			})
		}))
	}

	refreshStories = () => {
		this.props.api.get('/stories')
		.then((res)=>{
			this.setState({
				"stories":res.data['records']
			})
		})
	}

	handleDelete = () => {
		this.refreshStories()
		this.clearEditStory()
	}

	clearEditStory = () => {
		this.setState({
			"editStory":null
		})
	}

	setEditStory = (storyId) => {
		let story = this.state.stories[storyId]
		this.setState({
			"editStory": story
		})
	}

	render() {
		if(this.state.loading){
			return <div>Loading</div>
		}
		return (
			<div>
				<h1>My Story Ideas</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div className="list-group">
						<button className={
							this.state.editStory ?
								"list-group-item list-group-item-action" :
								"list-group-item list-group-item-action active"
						} onClick={() => { this.clearEditStory() }}>Add New Story</button>
						{this.state.stories.map((story, storyId) => (
							<button className={
								this.state.editStory === story ?
									"list-group-item list-group-item-action active" :
									"list-group-item list-group-item-action"
							} key={story.id} onClick={() => { this.setEditStory(storyId) }}>{story.name}</button>
						))}
					</div>

					<div style={{ "width": "50%" }}>
						{
							this.state.editStory ?
								<EditMyStories characters={this.state.characters} api={this.props.api} story={this.state.editStory} onEdit={this.refreshStories} onDelete={this.handleDelete} />
								: <NewMyStories characters={this.state.characters} api={this.props.api} onCreate={this.refreshStories} />
						}
					</div>
				</div>
			</div>
		)
	}

}
