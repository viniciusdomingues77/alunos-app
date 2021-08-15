import * as React from "react";
import { DataGrid, ptBR } from "@material-ui/data-grid";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import RadioGroup from "@material-ui/core/RadioGroup";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Radio from "@material-ui/core/Radio";
import Modal from "@material-ui/core/Modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import BarraProgressoFixa from "./barraprogressofixa";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import { useSelector, useDispatch } from "react-redux";
import { server } from "./server";
import {
  action,
  AppState,
  store,
  SetAgendaCanceladaAction,
} from "./ConfigSate";
const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    top: 0,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "3px solid #306898",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  cabecalho: {
    width: "100%",
    height: "10px",
  },
}));

export default function HistoricoAgendasTurma(props) {
  const [AgendasAluno, setAgendasAluno] = React.useState([]);
  const [FotoAluno, setFotoAluno] = React.useState([]);
  const [openError, setOpenError] = React.useState(false);
  const [select, setSelection] = React.useState("");
  const [textoExc, settextoExc] = React.useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [Cancelando, setCancelando] = React.useState(false);
  const [valueCancelamento, setValueCancelamento] = React.useState("");
  const [openModal, setopenModal] = React.useState(false);
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const dispatch = useDispatch();
  const classes = useStyles();
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "strdata", headerName: "Data", width: 110 },
    { field: "strhora", headerName: "Hora", width: 110 },
    { field: "diasemana", headerName: "Dia", width: 100 },
  ];
  const [openDialogoExc, setopenDialogoExc] = React.useState(false);
  const handleRadioChangeCancelamento = (event) => {
    // setvalueAgendaCancelada(false)
    setValueCancelamento(event.target.value);
  };
  const handleClickCancelaAgenda = () => {
    var idsstr = select.toString();

    if (!idsstr) {
      return;
    }
    if (idsstr.length == 0) {
      return;
    }
    var ids = idsstr.split(",");
    setopenModal(true);
    setValueCancelamento("professor");
  };
  const handleCloseModal = (event, reason) => {
    setopenModal(false);
  };
  const handleCloseExc = (event, reason) => {
    console.log("selecionados  " + select);
    setopenDialogoExc(false);
  };

  const handleClickCancelaAgendaConfirmacao = () => {
    dispatch(SetAgendaCanceladaAction(false));
    var idsstr = select.toString();
    var ids = idsstr.split(",");
    setopenModal(false);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idagendas: ids,
        stropcao: valueCancelamento,
      }),
    };
    setTextoBarraProgresso("Desmarcando");
    trackPromise(
      fetch(server + "/api/agenda/exclusaorange", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => setCancelando(true))
        .catch(function (error) {
          setOpenError(true);
          setCancelando(false);
        })
    );
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  React.useEffect(() => {
    dispatch(SetAgendaCanceladaAction(false));
    setTextoBarraProgresso("Carregando");
    const apiUrla = server + `/api/agenda/todasasagendas/` + props.idaluno;
    trackPromise(
      fetch(apiUrla)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAgendasAluno(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
    const apiUrlf = server + `/api/aluno/foto/` + props.idaluno;
    trackPromise(
      fetch(apiUrlf)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFotoAluno(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }, []);

  React.useEffect(() => {
    if (Cancelando) {
      setSelection("");
      setTextoBarraProgresso("Carregando agendas");
      const apiUrla = server + `/api/agenda/todasasagendas/` + props.idaluno;
      trackPromise(
        fetch(apiUrla)
          .then((response) => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response;
          })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setAgendasAluno(data);
          })
          .catch(function (error) {
            console.log("catch error" + error);
            setOpenError(true);
          })
      );
      dispatch(SetAgendaCanceladaAction(true));
      setCancelando(false);
    }
  }, [Cancelando]);

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <div className={classes.cabecalho}>
          <BarraProgressoFixa
            titulo={TextoBarraProgresso}
            loading={promiseInProgress}
          />
        </div>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Avatar className={classes.avatar} src={FotoAluno.foto}></Avatar>
        </Grid>
        <Grid
          item
          xs={8}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {FotoAluno.nome}
        </Grid>
        <Grid
          item
          xs={1}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <IconButton
            color="primary"
            aria-label="Remove Agenda"
            component="span"
            onClick={handleClickCancelaAgenda}
            disabled={promiseInProgress}
          >
            <EventBusyIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} style={{ marginLeft: 0 }}>
          <div style={{ height: 400, width: "600px" }}>
            <DataGrid
              rows={AgendasAluno}
              columns={columns.map((column) => ({
                ...column,
                sortable: false,
              }))}
              pageSize={5}
              checkboxSelection
              localeText={ptBR.props.MuiDataGrid.localeText}
              onSelectionModelChange={(e) => {
                setSelection(e.selectionModel);
              }}
            />
          </div>
        </Grid>
      </Grid>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Desmarcação</h2>
            <p id="transition-modal-description">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={valueCancelamento}
                onChange={handleRadioChangeCancelamento}
              >
                <FormControlLabel
                  value="professor"
                  control={<Radio />}
                  label="Desmarcado pelo professor"
                />
                <FormControlLabel
                  value="aluno"
                  control={<Radio />}
                  label="Desmarcado pelo aluno"
                />
              </RadioGroup>
            </p>
            <Grid container spacing={3}>
              <Grid
                item
                xs={6}
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleClickCancelaAgendaConfirmacao()}
                >
                  Desmarcar
                </Button>
              </Grid>
              <Grid
                item
                xs={6}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button variant="contained" onClick={() => setopenModal(false)}>
                  Fechar
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          Não foi possível realizar a operação. Contacte o desenvolvedor
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
