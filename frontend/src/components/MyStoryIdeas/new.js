import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

export default class NewMyStories extends React.Component {
	render() {
		if (this.props.characters[0]) {
			return (
				<Formik
					initialValues={{
						'name': '',
						'CharacterId': this.props.characters[0].id,
						'description': '',
					}}
					onSubmit={(values, { setSubmitting, resetForm }) => {
						this.props.api.post('/stories', {
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
							<button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Story</button>
						</Form>
					)}
				</Formik>
			)
		}
		return (
			<div class="alert alert-warning" role="alert">You need characters before you can make stories!</div>
		)
	}
}
