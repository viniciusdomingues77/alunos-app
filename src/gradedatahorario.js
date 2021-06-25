import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";

import Typography from "@material-ui/core/Typography";
import {
  action,
  AppState,
  store,
  SetIDAgendaSelProntuarioAction,
  SetIDAlunoSelProntuarioAction,
  SetDataSelProntuarioAction,
  SetFotoSelProntuarioAction,
} from "./ConfigSate";
const useStyles = makeStyles({
  root: {
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    padding: "5px",
    width: "100%",
    height: "250px",
    overflow: "auto",
  },
  boxcalendar: {
    color: "white",
    fontSize: "15px",
    // borderStyle: "solid",
    // borderWidth: "thin",
    // borderColor: "#3c52b2",
  },
  btncalendar: {
    background: "#306898",
    borderRadius: "3px",

    fontSize: "11px",
    border: "0",
    color: "white",
    padding: "0 10px",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#3c52b2",
    },
  },
});

export default function AgendasAluno() {
  const classes = useStyles();
  const [Agendas, setAgendas] = React.useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const idagenda = useSelector(
    (state) => state.configuracoes.IDAgendaSelProntuario
  );
  const idaluno = useSelector(
    (state) => state.configuracoes.IDAlunoSelProntuario
  );
  const dispatch = useDispatch();
  const SelIdAgenda = (idagenda, data) => {
    dispatch(SetIDAgendaSelProntuarioAction(idagenda));
    dispatch(SetDataSelProntuarioAction(new Date(data)));
  };

  React.useEffect(() => {
    const apiUrl = `https://localhost:44363/api/agenda/agendas/` + idaluno;
    trackPromise(
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAgendas(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          //setOpenError(true);
        })
    );
    const apiUrl2 = `https://localhost:44363/api/aluno/foto/` + idaluno;
    trackPromise(
      fetch(apiUrl2)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          dispatch(SetFotoSelProntuarioAction(data.foto));
        })
        .catch(function (error) {
          console.log("catch error" + error);
          //setOpenError(true);
        })
    );
  }, [idaluno]);

  return (
    <div className={classes.root}>
      <Box
        flexWrap="wrap"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        p={0}
        m={0}
        bgcolor="background.paper"
      >
        {idaluno == 0 && <Typography variant="h5">Agenda do aluno</Typography>}

        {Agendas.map((agenda) => (
          <Box
            className={classes.boxcalendar}
            style={{ marginTop: "2px", marginRight: "2px" }}
          >
            <Button
              className={classes.btncalendar}
              onClick={() => SelIdAgenda(agenda.idagenda, agenda.data)}
            >
              {agenda.strData} <br /> {agenda.strHora}
              <br />
              {agenda.diaSemana}
            </Button>
          </Box>
        ))}
      </Box>
    </div>
  );
}
