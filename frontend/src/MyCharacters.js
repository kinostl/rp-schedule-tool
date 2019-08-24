import React from 'react'

export default class MyCharacters extends React.Component {

	render() {
		return (
			<div>
				<h1>My Characters</h1>
			<div style={{"display":"flex", "justifyContent":"space-around"}}>
				<div style={{"width":"25%"}}>
					<ul>
						<li><input type="checkbox"/> Character 1</li>
						<li><input type="checkbox"/> Character 2</li>
						<li><input type="checkbox"/> Character 3</li>
						<li><input type="checkbox" checked/> Character 4</li>
						<li><input type="checkbox"/> Character 5</li>
					</ul>
				</div>

				<div style={{"width":"50%"}}>
					<form style={{"display":"flex","flexDirection":"column"}}>
						<label>Name</label>
						<input className="form-control" type="text"/>
						<label>Server</label>
						<select className="form-control">
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
