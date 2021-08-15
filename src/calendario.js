import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dates from "react-big-calendar/lib/utils/dates";
import * as datesUtility from "react-big-calendar/lib/utils/dates";
import { server } from "./server";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";

const localizer = momentLocalizer(moment);

// const events = [
//   {
//     title: 'All Day Event very long title',
//     allDay: true,
//     start: new Date(2021, 7, 10),
//     end: new Date(2021, 7, 10)
//   },
//   {
//     title: 'Long Event',
//     start: new Date(2021, 7, 11, 10, 20, 0),
//     end: new Date(2021, 7, 11, 11, 30, 0)
//   },
//   {
//     title: 'Long Event',
//     start: new Date(2021, 7, 11, 12, 20, 0),
//     end: new Date(2021, 7, 11, 13, 30, 0)
//   },
//   {
//     title: 'Long Event',
//     start: new Date(2021, 7, 11, 12, 20, 0),
//     end: new Date(2021, 7, 11, 13, 30, 0)
//   }
// ]

export default function Calendario() {
  const [Events, setEvents] = React.useState([]);
  const [Eventos, setEventos] = React.useState([]);

  function CallEvents(dti, dtf) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dtini: ConverteJavascriptDateToCDate(dti),
        dtfim: ConverteJavascriptDateToCDate(dtf),
      }),
    };

    const apiUrl = server + `/api/agenda/calendario/`;
    trackPromise(
      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setEvents(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          // setOpenError(true)
        })
    );
  }

  React.useEffect(() => {
    // setTextoBarraProgresso('Listando alunos')
    var dtini = datesUtility.firstVisibleDay(new Date(Date.now()), localizer);
    var dtfim = datesUtility.lastVisibleDay(new Date(Date.now()), localizer);
    console.log(
      datesUtility.firstVisibleDay(new Date(Date.now()), localizer),
      datesUtility.lastVisibleDay(new Date(Date.now()), localizer)
    );
    CallEvents(dtini, dtfim);
  }, []);

  React.useEffect(() => {
    console.log("Events " + Events);
    const fetchEvents = async () => {
      await Events.forEach(CarregaEventos);
      setEventos(events);
    };

    fetchEvents();
  }, [Events]);

  var events = [];

  function CarregaEventos(value, index, array) {
    let dtini = new Date(
      value.anoevento,
      value.mesevento,
      value.diaevento,
      value.hr,
      value.minuto,
      value.segundo
    );

    let dtfim = new Date(
      value.anoeventofim,
      value.meseventofim,
      value.diaeventofim,
      value.hrfim,
      value.minutofim,
      value.segundofim
    );

    let title = value.ident;
    events.push({
      title: title,
      start: dtini,
      end: dtfim,
      resourceId: { id: value.id, origem: value.origem },
    });
  }

  React.useEffect(() => {
    console.log("Eventos " + Eventos);
  }, [Eventos]);

  function ConverteJavascriptDateToCDate(dtjs) {
    var dia = dtjs.getDate();
    var mes = dtjs.getMonth();
    var ano = dtjs.getFullYear();
    var hora = dtjs.getHours();
    var minuto = dtjs.getMinutes();
    var segundo = dtjs.getSeconds();

    if (dia.toString().length == 1) {
      dia = "0" + dia;
    }
    if (mes.toString().length == 1) {
      mes = "0" + mes;
    }

    if (minuto.toString().length == 1) {
      minuto = "0" + minuto;
    }

    if (hora.toString().length == 1) {
      hora = "0" + hora;
    }

    if (segundo.toString().length == 1) {
      segundo = "0" + segundo;
    }

    var datacc =
      dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;

    return datacc;
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={Eventos}
        startAccessor="start"
        endAccessor="end"
        defaultDate={new Date(Date.now())}
        style={{ height: 500 }}
        onSelectEvent={(event, SyntheticEvent) => {
          console.log("id event " + event.resourceId.id);
        }}
        onNavigate={(date, view, action) => {
          CallEvents(
            datesUtility.firstVisibleDay(date, localizer),
            datesUtility.lastVisibleDay(date, localizer)
          );
          // console.log(
          //   datesUtility.firstVisibleDay(date, localizer),
          //   datesUtility.lastVisibleDay(date, localizer)
          // )
        }}
      />
    </div>
  );
}
