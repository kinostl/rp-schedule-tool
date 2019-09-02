import React from 'react'
import api from './api'
import {Formik, Form, Field, ErrorMessage } from 'formik'

export default class MyCharacters extends React.Component {
	constructor(){
		super()
		this.state={
			"loading":true,
			"characters":[]
		}
	}

	componentDidMount(){
		api.get('/characters', {
			headers: {
				'X-Authorization': this.props.token
			}
		})
		.then((res)=>{
			this.setState({
				"loading":false,
				"characters":res.data['records']
			})
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
						{this.state.characters.map((character)=>(
							<li key={character.id}><button class="btn btn-link" value={character.id}>{character.name}</button></li>
						))}
					</ul>
				</div>

				<div style={{"width":"50%"}}>
						<Formik
							initialValues={{
								'name': '',
								'ServerId': '',
								'description': '',
							}}
							onSubmit={(values, { setSubmitting }) => {
								console.log("token", this.props.token)
								api.post('/characters', {
									...values,
								}, {
										headers: {
											'X-Authorization': this.props.token
										}
									}).then((res) => {
										console.log("res", res)
										setSubmitting(false)
									})
							}}
						>
							{({ isSubmitting }) => (
								<Form style={{ "display": "flex", "flexDirection": "column" }}>
									<label>Name</label>
									<Field className="form-control" type="text" name="name" />
									<label>Server</label>
									<Field component="select" name="ServerId" className="custom-select">
										{this.props.user.servers.map((server)=>(
											<option value={server.id}>{server.name}</option>
										))}
									</Field>
									<label>Description (Markdown compatible)</label>
									<Field type="textarea" name="description" className="form-control" />
									<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Character</button>
									<button type="submit" className="btn btn-danger">Delete Character</button>
								</Form>
							)}
						</Formik>
				</div>
			</div>
			</div>
		)
	}

}
