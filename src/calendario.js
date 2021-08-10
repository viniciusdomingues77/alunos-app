import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dates from 'react-big-calendar/lib/utils/dates'
import * as datesUtility from 'react-big-calendar/lib/utils/dates'
const localizer = momentLocalizer(moment)

const events = [
  {
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2021, 7, 10),
    end: new Date(2021, 7, 10)
  },
  {
    title: 'Long Event',
    start: new Date(2021, 7, 11, 10, 20, 0),
    end: new Date(2021, 7, 11, 11, 30, 0)
  },
  {
    title: 'Long Event',
    start: new Date(2021, 7, 11, 12, 20, 0),
    end: new Date(2021, 7, 11, 13, 30, 0)
  },
  {
    title: 'Long Event',
    start: new Date(2021, 7, 11, 12, 20, 0),
    end: new Date(2021, 7, 11, 13, 30, 0)
  }
]

const MyCalendar = props => (
  <div>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor='start'
      endAccessor='end'
      date={new Date(Date.now())}
      style={{ height: 500 }}
      onNavigate={(date, view, action) => {
        console.log(
          datesUtility.firstVisibleDay(date, localizer),
          datesUtility.lastVisibleDay(date, localizer)
        )
      }}
    />
  </div>
)

export default function Calendario () {
  React.useEffect(() => {
    console.log(
      datesUtility.firstVisibleDay(new Date(Date.now()), localizer),
      datesUtility.lastVisibleDay(new Date(Date.now()), localizer)
    )
  }, [])

  return <MyCalendar />
}
