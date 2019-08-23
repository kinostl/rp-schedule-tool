import React from 'react'

export default class MyStoryIdeas extends React.Component {

	render() {
		return (
			<div>
				<h1>My Story Ideas</h1>
			<div style={{"display":"flex", "justifyContent":"space-around"}}>
				<div style={{"width":"25%"}}>
					<ul>
						<li><input type="checkbox"/> Story 1</li>
						<li><input type="checkbox"/> Story 2</li>
						<li><input type="checkbox"/> Story 3</li>
						<li><input type="checkbox" checked/> Story 4</li>
						<li><input type="checkbox"/> Story 5</li>
					</ul>
				</div>

				<div style={{"width":"50%"}}>
					<form style={{"display":"flex","flexDirection":"column"}}>
						<label>Title</label>
						<input type="text"/>
						<label>Character</label>
						<select>
							<option>Character 1 (Server 1)</option>
							<option>Character 1 (Server 2)</option>
						</select>
						<label>Description (Markdown compatible)</label>
						<textarea></textarea>
						<input type="submit" value="Add Story Idea"/>
						<input type="button" value="Delete Story Idea"/>
					</form>
				</div>
			</div>
			</div>
		)
	}

}
