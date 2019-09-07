import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

export default class EditMyCharacters extends React.Component {
	onDelete(value){
		this.props.api.delete(`/characters/${value}`).then((res) => {
			this.props.onDelete()
		})
	}

	render() {
		return (
			<Formik
				enableReinitialize
				initialValues={{
					'name': this.props.character.name,
					'ServerId': this.props.character.ServerId,
					'description': this.props.character.description,
				}}
				onSubmit={(values, { setSubmitting }) => {
					this.props.api.put(`/characters/${this.props.character.id}`, values).then((res) => {
						this.props.onEdit()
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
							{this.props.servers.map((server) => (
								<option value={server.id}>{server.name}</option>
							))}
						</Field>
						<label>Description (Markdown compatible)</label>
						<Field type="textarea" name="description" className="form-control" />
						<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save Character</button>
						<button type="button" className="btn btn-danger" onClick={()=>{this.onDelete(this.props.character.id)}} disabled={isSubmitting}>Delete Character</button>
					</Form>
				)}
			</Formik>
		)
	}

}
