import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dates from "react-big-calendar/lib/utils/dates";
import * as datesUtility from "react-big-calendar/lib/utils/dates";
import { server } from "./server";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  action,
  AppState,
  store,
  SetOpenEventoAgendaAction,
  SetEventoAgendaAction,
  SetCalendarioAtualizarAction,
} from "./ConfigSate";
import { useSelector, useDispatch } from "react-redux";
import DialogoCalendario from "./dialogocalendario";
import BarraProgressoFixa from "./barraprogressofixa";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  cabecalho: {
    with: "100%",
    height: "15px",
  },
}));

export default function Calendario() {
  const [Events, setEvents] = React.useState([]);
  const [Eventos, setEventos] = React.useState([]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const CalendarioAtualizar = useSelector(
    (state) => state.configuracoes.CalendarioAtualizar
  );
  const { promiseInProgress } = usePromiseTracker();
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [openError, setOpenError] = React.useState(false);

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  function CallEvents(dti, dtf) {
    setTextoBarraProgresso("Listando calendário");

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
          setOpenError(true);
        })
    );
  }

  React.useEffect(() => {
    var dtini = datesUtility.firstVisibleDay(new Date(Date.now()), localizer);
    var dtfim = datesUtility.lastVisibleDay(new Date(Date.now()), localizer);
    console.log(
      datesUtility.firstVisibleDay(new Date(Date.now()), localizer),
      datesUtility.lastVisibleDay(new Date(Date.now()), localizer)
    );
    CallEvents(dtini, dtfim);
  }, []);

  React.useEffect(() => {
    if (CalendarioAtualizar) {
      var dtini = datesUtility.firstVisibleDay(new Date(Date.now()), localizer);
      var dtfim = datesUtility.lastVisibleDay(new Date(Date.now()), localizer);
      console.log(
        datesUtility.firstVisibleDay(new Date(Date.now()), localizer),
        datesUtility.lastVisibleDay(new Date(Date.now()), localizer)
      );
      CallEvents(dtini, dtfim);
      dispatch(SetCalendarioAtualizarAction(false));
    }
  }, [CalendarioAtualizar]);

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
      resourceId: {
        id: value.id,
        origem: value.origem,
        idident: value.idident,
      },
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
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>

      <Calendar
        localizer={localizer}
        events={Eventos}
        startAccessor="start"
        endAccessor="end"
        disabled={promiseInProgress}
        defaultDate={new Date(Date.now())}
        style={{ height: 500, marginTop: 10 }}
        onSelectEvent={(event, SyntheticEvent) => {
          console.log("id event " + event.resourceId.id);
          console.log("origem " + event.resourceId.origem);
          dispatch(
            SetEventoAgendaAction({
              title: event.title,
              start: event.start,
              end: event.end,
              resourceId: {
                id: event.resourceId.id,
                origem: event.resourceId.origem,
                idident: event.resourceId.idident,
              },
            })
          );
          dispatch(SetOpenEventoAgendaAction(true));
        }}
        onNavigate={(date, view, action) => {
          CallEvents(
            datesUtility.firstVisibleDay(date, localizer),
            datesUtility.lastVisibleDay(date, localizer)
          );
        }}
      />
      <DialogoCalendario operError={openError} setOpenError={setOpenError} />
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          Não foi possível realizar a operação. Contacte o desenvolvedor
        </Alert>
      </Snackbar>
    </div>
  );
}
