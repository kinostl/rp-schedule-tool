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
            "calendarView": props.view || "dayGridMonth"
        }
        this.calendarRef = React.createRef()
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <FullCalendar
                        ref={this.calendarRef}
                        defaultView={this.props.defaultView||"dayGridMonth"}
                        header={{
                          left: 'prev,next today',
                          center: 'title',
                          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        nowIndicator={true}
                        themeSystem='bootstrap'
                        dateClick={this.props.dateClick}
                        select={this.props.select}
                        eventClick={this.props.eventClick}
                        slotDuration={this.props.slotDuration || "00:30:00"}
                        selectable={this.props.selectable}
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            bootstrapPlugin,
                            listPlugin,
                            interactionPlugin,
                        ]}
                        events={this.props.events || []} />
                </div>
            </div>
        )
    }
}