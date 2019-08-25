import React from 'react'

export default class MyCharacters extends React.Component {

	render() {
		return (
			<div>
				<h1>My Characters</h1>
			<div style={{"display":"flex", "justifyContent":"space-around"}}>
				<div>
					<ul style={{"listStyle":"none"}}>
						<li><button class="btn btn-link"> Character 1</button></li>
						<li><button class="btn btn-link"> Character 2</button></li>
						<li><button class="btn btn-link"> Character 3</button></li>
						<li><button class="btn btn-link"> Character 4</button></li>
						<li><button class="btn btn-link"> Character 5</button></li>
					</ul>
				</div>

				<div style={{"width":"50%"}}>
					<form style={{"display":"flex","flexDirection":"column"}}>
						<label>Name</label>
						<input className="form-control" type="text"/>
						<label>Server</label>
						<select className="custom-select">
							<option>Server 1</option>
							<option>Server 2</option>
						</select>
						<label>Description (Markdown compatible)</label>
						<textarea className="form-control"></textarea>
						<input className="btn btn-primary" type="submit" value="Add Character"/>
						<input className="btn btn-danger" type="button" value="Delete Character"/>
					</form>
				</div>
			</div>
			</div>
		)
	}

}
