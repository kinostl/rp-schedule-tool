import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

export default class EditMyStories extends React.Component {
	onDelete(value){
		this.props.api.delete(`/stories/${value}`).then((res) => {
			this.props.onDelete()
		})
	}

	render() {
		return (
			<Formik
				enableReinitialize
				initialValues={{
					'name': this.props.story.name,
					'CharacterId': this.props.story.CharacterId,
					'description': this.props.story.description,
				}}
				onSubmit={(values, { setSubmitting }) => {
					this.props.api.put(`/stories/${this.props.story.id}`, values).then((res) => {
						this.props.onEdit()
						setSubmitting(false)
					})
				}}
			>
				{({ isSubmitting }) => (
					<Form style={{ "display": "flex", "flexDirection": "column" }}>
						<label>Title</label>
						<Field className="form-control" type="text" name="name" />
						<label>Character</label>
						<Field component="select" name="CharacterId" className="custom-select">
							{this.props.characters.map((character) => (
								<option value={character.id}>{character.name}</option>
							))}
						</Field>
						<label>Description (Markdown compatible)</label>
						<Field type="textarea" name="description" className="form-control" />
						<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save Story</button>
						<button type="button" className="btn btn-danger" onClick={()=>{this.onDelete(this.props.story.id)}} disabled={isSubmitting}>Delete Story</button>
					</Form>
				)}
			</Formik>
		)
	}

}
