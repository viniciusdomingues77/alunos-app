import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {
  action,
  AppState,
  store,
  SetIDAgendaSelProntuarioAction,
  SetIDAlunoSelProntuarioAction,
  SetNomeAlunoSelProntuarioAction,
  SetDataSelProntuarioAction,
  SetHoraSelProntuarioAction,
  SetFotoSelProntuarioAction,
} from "./ConfigSate";
import { isClassExpression } from "typescript";
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    padding: "5px",
    width: "100%",
    height: "250px",
    overflow: "auto",
    //backgroundColor: '#F5F5F5'
    backgroundColor: "white",
  },
  boxcalendar: {
    color: "#F5F5F5",
    fontSize: "15px",
    // borderStyle: "solid",
    // borderWidth: "thin",
    // borderColor: "#3c52b2",
  },
  btncalendar: {
    //background: '#F5F5F5',
    backgroundColor: "white",
    borderRadius: "3px",
    borderColor: "#306898",
    fontSize: "11px",
    color: "#306898",
    padding: "0 10px",
    "&:hover": {
      backgroundColor: "#fff",
      color: "gray",
    },
  },
  divCabecalhoCalendario: {
    //background: '#F5F5F5',
    backgroundColor: "white",
    width: "100%",
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function AgendasAluno(props) {
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
  const nmaluno = useSelector(
    (state) => state.configuracoes.NomeAlunoSelProntuario
  );
  const idprofessor = useSelector(
    (state) => state.configuracoes.IDProfessorSelProntuario
  );
  const fotoalunosel = useSelector(
    (state) => state.configuracoes.FotoAlunoSelProntuario
  );
  const dispatch = useDispatch();
  const SelIdAgenda = (idagenda, data,strHora) => {
    dispatch(SetIDAgendaSelProntuarioAction(idagenda));
    dispatch(SetDataSelProntuarioAction(new Date(data)));
    dispatch(SetHoraSelProntuarioAction(strHora));
  };
  const LimpaRedux = () => {
    console.log("LimpaRedux");
    //dispatch(SetIDAlunoSelProntuarioAction(0))
    dispatch(SetNomeAlunoSelProntuarioAction(""));
    //dispatch(SetIDProfessorSelProntuarioAction(0))
    dispatch(SetFotoSelProntuarioAction(""));
    dispatch(SetIDAgendaSelProntuarioAction(0));
    dispatch(SetHoraSelProntuarioAction(''));
  };

  const CarregaAgendas = () => {
    console.log("carrega agendas");
    var idalunosel = 0;

    if (idaluno) {
      idalunosel = idaluno;
    }

    var idprofessorsel = 0;
    if (idprofessor) {
      idprofessorsel = idprofessor;
    }
    console.log("idaluno " + idaluno);
    const apiUrl =
      `https://localhost:44363/api/agenda/agendas/` +
      idaluno +
      "/" +
      idprofessorsel;
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
          setAgendas([]);
          if (idaluno > 0) {
            props.setOpenError(true);
          }
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
          dispatch(SetFotoSelProntuarioAction(""));
          if (idaluno > 0) {
            props.setOpenError(true);
          }
        })
    );
  };

  React.useEffect(() => {
    if (idaluno == 0) {
      console.log("aluno zero");
      dispatch(SetFotoSelProntuarioAction(""));
      LimpaRedux();
      setAgendas([]);
    }
  });

  React.useEffect(() => {
    //LimpaRedux()
    dispatch(SetIDAlunoSelProntuarioAction(0));
  }, []);
  React.useEffect(() => {
    CarregaAgendas();
  }, [idaluno]);

  React.useEffect(() => {
    CarregaAgendas();
  }, [idprofessor]);

  return (
    <div className={classes.root}>
      <div className={classes.divCabecalhoCalendario}>
        <Box
          flexWrap="wrap"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          p={0}
          m={1}
          bgcolor="white"
        >
          <Avatar className={classes.avatar} src={fotoalunosel}></Avatar>
          <Typography
            variant="overline"
            style={{ marginLeft: 10, color: "grey" }}
          >
            {/* Agendas {nmaluno != ''  && (<span>de</span>)} {nmaluno} */}
            Agendas do Aluno
          </Typography>
        </Box>
      </div>

      <Box
        flexWrap="wrap"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        p={0}
        m={0}
        bgcolor="white"
      >
        {Agendas.map((agenda) => (
          <Box
            className={classes.boxcalendar}
            border={1}
            borderColor="grey.500"
            borderRadius="5%"
            style={{ marginTop: "2px", marginRight: "2px" }}
          >
            <Button
              className={classes.btncalendar}
              onClick={() => SelIdAgenda(agenda.idagenda, agenda.data,agenda.strHora)}
              disabled={props.disabled}
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
