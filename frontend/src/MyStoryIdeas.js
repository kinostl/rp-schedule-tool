import React from 'react'

export default class MyStoryIdeas extends React.Component {

	render() {
		return (
			<div>
				<h1>My Story Ideas</h1>
				<div style={{ "display": "flex", "justifyContent": "space-around" }}>
					<div>
						<ul style={{ "listStyle": "none" }}>
							<li><button class="btn btn-link"> Story 1</button></li>
							<li><button class="btn btn-link"> Story 2</button></li>
							<li><button class="btn btn-link"> Story 3</button></li>
							<li><button class="btn btn-link"> Story 4</button></li>
							<li><button class="btn btn-link"> Story 5</button></li>
						</ul>
					</div>

					<div style={{ "width": "50%" }}>
						<form style={{ "display": "flex", "flexDirection": "column" }}>
							<label>Title</label>
							<input className="form-control" type="text" />
							<label>Character</label>
							<select className="custom-select">
								<option>Character 1 (Server 1)</option>
								<option>Character 1 (Server 2)</option>
							</select>
							<label>Description (Markdown compatible)</label>
							<textarea className="form-control"></textarea>
							<input className="btn btn-primary" type="submit" value="Add Story Idea" />
							<input className="btn btn-danger" type="button" value="Delete Story Idea" />
						</form>
					</div>
				</div>
			</div>
		)
	}

}
