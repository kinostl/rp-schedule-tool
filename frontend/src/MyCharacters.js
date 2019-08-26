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
		api.get('/characters')
		.then((res)=>{
			this.setState({
				"loading":false,
				"characters":res.data
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
						<li><button class="btn btn-link"> Character 1</button></li>
						<li><button class="btn btn-link"> Character 2</button></li>
						<li><button class="btn btn-link"> Character 3</button></li>
						<li><button class="btn btn-link"> Character 4</button></li>
						<li><button class="btn btn-link"> Character 5</button></li>
					</ul>
				</div>

				<div style={{"width":"50%"}}>
						<Formik
							initialValues={{
								'name': '',
								'ServerId': '',
								'description': '',
							}}
							onSubmit={(values,{setSubmitting})=>{
								api.post('/characters', {
									"UserId": 1,
									...values
								}).then((res) => {
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
										<option value={1}>Server 1</option>
										<option value={2}>Server 2</option>
									</Field>
									<label>Description (Markdown compatible)</label>
									<Field type="textarea" name="description" className="form-control" />
									<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Character</button>
									<button type="submit" className="btn btn-primary">Delete Character</button>
								</Form>
							)}
						</Formik>
				</div>
			</div>
			</div>
		)
	}

}
