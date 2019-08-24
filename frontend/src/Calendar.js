import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import bootstrapPlugin from '@fullcalendar/bootstrap';

import './main.scss' // webpack must be configured to do this

export default class Calendar extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
			"calendarView": props.view?props.view:"dayGridMonth"
		}
		this.calendarRef = React.createRef()
    }
    
    render() {
        return (
            <div>
                {
                    this.props.multiView?(<select value={this.state.calendarView} onChange={(e) => {
                        let newView = e.target.value
                        let calendarApi = this.calendarRef.current.getApi()
                        calendarApi.changeView(newView)
                        this.setState({ "calendarView": newView })
                    }}>
                        <option value="dayGridMonth">Monthly</option>
                        <option value="timeGridWeek">Weekly</option>
                        <option value="timeGrid">Daily</option>
                    </select>):null
                }
                <FullCalendar
                    ref={this.calendarRef}
                    defaultView={this.state.calendarView}
                    nowIndicator={true}
                    themeSystem='bootstrap'
                    slotDuration={this.props.slotDuration}
                    selectable={this.props.selectable}
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        bootstrapPlugin,
                        listPlugin,
                        interactionPlugin,
                    ]}
                    events={this.props.events} />
            </div>
        )
    }
}