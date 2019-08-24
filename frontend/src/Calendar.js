import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import bootstrapPlugin from '@fullcalendar/bootstrap';

import './main.scss' // webpack must be configured to do this

const Calendar = React.forwardRef((props, ref) => (
    < FullCalendar
        {...props}
        ref={ref}
        defaultView={props.defaultView || "dayGridMonth"}
        header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        nowIndicator={true}
        themeSystem='bootstrap'
        plugins={
            [
                dayGridPlugin,
                timeGridPlugin,
                bootstrapPlugin,
                listPlugin,
                interactionPlugin,
            ]} />))

export default Calendar
