import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

export default class NewMyCharacters extends React.Component {
	render() {
		return (
			<Formik
				initialValues={{
					'name': '',
					'ServerId': this.props.servers[0].id,
					'description': '',
				}}
				onSubmit={(values, { setSubmitting, resetForm }) => {
					this.props.api.post('/characters', {
						...values,
					}).then((res) => {
						this.props.onCreate()
						setSubmitting(false)
						resetForm()
					})
				}}
			>
				{({ isSubmitting }) => (
					<Form style={{ "display": "flex", "flexDirection": "column" }}>
						<label>Name</label>
						<Field className="form-control" type="text" name="name" />
						<label>Server</label>
						<Field component="select" name="ServerId" className="custom-select">
							{this.props.servers.map((server) => (
								<option value={server.id}>{server.name}</option>
							))}
						</Field>
						<label>Description (Markdown compatible)</label>
						<Field type="textarea" name="description" className="form-control" />
						<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Character</button>
					</Form>
				)}
			</Formik>
		)
	}

}
