import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { yellow } from "@material-ui/core/colors";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import SaveIcon from "@material-ui/icons/Save";
import BarraProgresso from "./barradeprogresso";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import BarraProgressoFixa from "./barraprogressofixa";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { server } from "./server";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  btn: {
    margin: 0,
  },
  cabecalho: {
    with: "100%",
    height: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #306898",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  divDiaSemana: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rootDiasdaSemana: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
export default function AgendamentoTurma() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedHour, setSelectedHour] = React.useState(new Date());
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [Turmas, setTurmas] = React.useState([]);
  const [professores, setProfessores] = React.useState([]);
  const [openError, setOpenError] = React.useState(false);
  const [TurmaError, setTurmaError] = React.useState(false);
  const [DataError, setDataError] = React.useState(false);
  const [HourError, setHourError] = React.useState(false);
  const [ProfessorError, setProfessorError] = React.useState(false);
  const [Turma, setTurma] = React.useState("");
  const [ModalTexto, setModalTexto] = React.useState("");
  const [ModalTitulo, setModalTitulo] = React.useState("");
  const [openModal, setopenModal] = React.useState(false);
  const [HorarioOcupado, setHorarioOcupado] = React.useState(false);
  const [Professor, setProfessor] = React.useState("");
  const [DiaSemanaExt, setDiaSemanaExt] = React.useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [MarcacaoSemestral, setMarcacaoSemestral] = React.useState(false);
  const [textoConfirmaAgendamento, settextoConfirmaAgendamento] =
    React.useState("");
  const { openErr } = openError;
  const [openDialogoConf, setopenDialogoConf] = React.useState(false);
  const [Valor, setValor] = React.useState(0);
  const handleChangeMarcacaoSemestral = (event) => {
    setMarcacaoSemestral(event.target.checked);
  };
  const [stateDiasdaSemanana, setStateDiasdaSemanana] = React.useState({
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });

  const handleChangeDiasDaSemana = (event) => {
    setStateDiasdaSemanana({
      ...stateDiasdaSemanana,
      [event.target.name]: event.target.checked,
    });
  };

  const { segunda, terca, quarta, quinta, sexta, sabado, domingo } =
    stateDiasdaSemanana;
  React.useEffect(() => {
    setTextoBarraProgresso("Listando turmas e professores");
    const apiUrl = server + `/api/turma/`;
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
          setTurmas(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );

    const apiUrlp = server + `/api/professor`;
    trackPromise(
      fetch(apiUrlp)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProfessores(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );

    setDiaSemanaExt(DiaDaSemana(new Date()));
    var diadasemana = DiaDaSemanaChk(new Date());

    setStateDiasdaSemanana({
      ...stateDiasdaSemanana,
      [diadasemana]: true,
    });
  }, []);
  function ClearFields() {
    setTurma("");
    setValor(0);
    setProfessor("");
    setSelectedDate(new Date());
    setSelectedHour(new Date());
  }
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDiaSemanaExt(DiaDaSemana(date));
    var diadasemana = DiaDaSemanaChk(date);
    setStateDiasdaSemanana({
      ...stateDiasdaSemanana,
      [diadasemana]: true,
    });
  };

  function DiaDaSemana(date) {
    var numdiasemana = date.getDay();
    var diasemana = "";
    switch (numdiasemana) {
      case 0:
        diasemana = "Domingo";
        break;
      case 1:
        diasemana = "Segunda";
        break;
      case 2:
        diasemana = "Terça";
        break;
      case 3:
        diasemana = "Quarta";
        break;
      case 4:
        diasemana = "Quinta";
        break;
      case 5:
        diasemana = "Sexta";
        break;
      case 6:
        diasemana = "Sabado";
        break;

      default:
    }
    return diasemana;
  }

  function DiaDaSemanaChk(date) {
    var numdiasemana = date.getDay();
    var diasemana = "";
    switch (numdiasemana) {
      case 0:
        diasemana = "domingo";
        break;
      case 1:
        diasemana = "segunda";
        break;
      case 2:
        diasemana = "terca";
        break;
      case 3:
        diasemana = "quarta";
        break;
      case 4:
        diasemana = "quinta";
        break;
      case 5:
        diasemana = "sexta";
        break;
      case 6:
        diasemana = "sabado";
        break;

      default:
    }
    return diasemana;
  }

  function MesporExtenso(nummes) {
    switch (nummes) {
      case 0:
        return "Janeiro";
        break;
      case 1:
        return "Fevereiro";
        break;
      case 2:
        return "Março";
        break;
      case 3:
        return "Abril";
        break;
      case 4:
        return "Maio";
        break;
      case 5:
        return "Junho";
        break;
      case 6:
        return "Julho";
        break;
      case 7:
        return "Agosto";
        break;
      case 8:
        return "Setembro";
        break;
      case 9:
        return "Outubro";
        break;
      case 10:
        return "Novembro";
        break;
      case 11:
        return "Dezembro";
        break;

      default:
    }
  }
  const handleHourChange = (hour) => {
    setSelectedHour(hour);
  };
  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = openSuccess;
  const [SubmitSuccess, setSubmitSuccess] = React.useState(0);
  React.useLayoutEffect(() => {
    console.log("promiseInProgress " + promiseInProgress);
    if (!promiseInProgress) {
      if (SubmitSuccess > 0) {
        setOpenSuccess({ open: true, vertical: "top", horizontal: "center" });
      } else {
        if (SubmitSuccess == -1) {
          setModalTexto("Este horário já se encontra ocupado");
          setModalTitulo("Problemas no agendamento");
          setopenModal(true);
        }
      }

      //ClearFields()
    }
  }, [promiseInProgress]);
  function ValidaCampos() {
    var camposinvalidos = false;

    if (
      stateDiasdaSemanana.segunda == false &&
      stateDiasdaSemanana.terca == false &&
      stateDiasdaSemanana.quarta == false &&
      stateDiasdaSemanana.quinta == false &&
      stateDiasdaSemanana.sexta == false &&
      stateDiasdaSemanana.sabado == false &&
      stateDiasdaSemanana.domingo == false
    ) {
      return false;
    }
    if (!Turma) {
      setTurmaError(true);
      return false;
    }

    if (!Professor) {
      setProfessorError(true);
      return false;
    }

    if (Turma.length == 0) {
      setTurmaError(true);
    } else {
      if (Turma == "0") {
        setTurmaError(true);
        camposinvalidos = true;
      } else {
        setTurmaError(false);
      }
    }
    if (Professor.length == 0) {
      setProfessorError(true);
      camposinvalidos = true;
      return;
    } else {
      if (Turma == "0") {
        setProfessorError(true);
        camposinvalidos = true;
      } else {
        setProfessorError(false);
      }
    }

    if (selectedDate == "Invalid Date") {
      setDataError(true);
      camposinvalidos = true;
    } else {
      setDataError(false);
    }

    if (selectedHour == "Invalid Date") {
      setHourError(true);
      camposinvalidos = true;
    } else {
      setHourError(false);
    }

    return !camposinvalidos;
  }
  const handleClickConfirmar = () => {
    if (!ValidaCampos()) {
      return;
    }

    var minutes = selectedHour.getMinutes();
    var minutesstr = minutes.toString();
    if (minutesstr.length == 1) {
      minutesstr = "0" + minutesstr;
    }
    var hour = selectedHour.getHours();
    var hora = hour + ":" + minutesstr;
    if (MarcacaoSemestral === true) {
      var msg =
        "A turma será agendada para " +
        DiaSemanaExt +
        " às " +
        hora +
        " para os próximos seis meses (180 dias) contabilizando um total de 24 aulas. Confirma?";
    } else {
      var ano = selectedDate.getFullYear();
      var mes = MesporExtenso(selectedDate.getMonth());
      var dia = selectedDate.getDate();
      var dt = dia + " de " + mes + " de " + ano;
      var msg =
        "A turma será agendada para " + dt + " às " + hora + " Confirma?";
    }
    settextoConfirmaAgendamento(msg);
    setopenDialogoConf(true);
  };
  const HandleSaveClick = () => {
    setSubmitSuccess(0);
    setOpenError(false);
    var url = "";
    if (MarcacaoSemestral === true) {
      url = server + "/api/agenda/semestre/";
    } else {
      url = server + "/api/agenda/agendaturma";
    }

    var idTurma = Turma.substring(0, Turma.indexOf("-")).trim();
    var idprofessor = Professor.substring(0, Professor.indexOf("-")).trim();
    console.log("idTurma " + idTurma);
    console.log("idprofessor " + idprofessor);
    console.log("date " + selectedDate);
    console.log("hour " + selectedHour);
    console.log("dias da semana " + stateDiasdaSemanana);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diasdasemana: stateDiasdaSemanana,
        idTurma: idTurma,
        idprofessor: idprofessor,
        data: selectedDate,
        hora: selectedHour,
        agendarsemestre: MarcacaoSemestral,
        valor_aula: Valor,
      }),
    };

    setTextoBarraProgresso("Agendando");
    trackPromise(
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => setSubmitSuccess(d))

        .catch(function (error) {
          console.log("catch error" + error);
          setSubmitSuccess(0);
          setOpenError(true);
        })
    );
    setopenDialogoConf(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess({ open: false, vertical: "top", horizontal: "center" });
  };
  const handleCloseModal = (event, reason) => {
    setopenModal(false);
  };
  const handleCloseConf = () => {
    setopenDialogoConf(false);
  };
  const handleValorChange = (e) => {
    setValor(e.currentTarget.value);
  };
  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Autocomplete
              value={Turma}
              id="autocomplete"
              onChange={(event, newValue) => {
                if (newValue) {
                  setTurma(newValue);
                  const values = newValue.split("-");
                  let idTurma = values[0];
                  //setTextoBarraProgresso("Recuperando valor da aula");
                  // const apiUrl = server + `/api/aluno/valoraula/` + idaluno;
                  // trackPromise(
                  //   fetch(apiUrl)
                  //     .then((response) => {
                  //       if (!response.ok) {
                  //         throw Error(response.statusText);
                  //       }
                  //       return response;
                  //     })
                  //     .then((res) => res.json())
                  //     .then((data) => {
                  //       console.log(data);
                  //       setValor(data);
                  //     })
                  //     .catch(function (error) {
                  //       setOpenError(true);
                  //     })
                  // );
                } else {
                  setTurma("");
                  setValor(0);
                }
              }}
              options={Turmas.map(
                (turma) => `${turma.idturma} - ${turma.turma}`
              )}
              getOptionSelected={(option, value) => {
                return option === value;
              }}
              style={{ width: "100%", marginBottom: 5 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={promiseInProgress}
                  label="Turma"
                  autoFocus
                  variant="outlined"
                />
              )}
            />
            {TurmaError && (
              <FormHelperText id="component-error-text" error>
                Indique a turma
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Autocomplete
              value={Professor}
              id="autocomplete"
              onChange={(event, newValue) => {
                setProfessor(newValue);
                if (newValue) {
                }
              }}
              options={professores.map(
                (professor) => `${professor.idprofessor} - ${professor.nome}`
              )}
              getOptionSelected={(option, value) => {
                return option === value;
              }}
              style={{ width: "100%", marginBottom: 5 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Professor"
                  autoFocus
                  variant="outlined"
                  disabled={promiseInProgress}
                />
              )}
            />
            {ProfessorError && (
              <FormHelperText id="component-error-text" error>
                Indique o Professor
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={2}></Grid>

          <Grid item xs={2}></Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Data"
                format="dd/MM/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                disabled={promiseInProgress}
              />
            </MuiPickersUtilsProvider>
            {DataError && (
              <FormHelperText id="component-error-text" error>
                Indique a data
              </FormHelperText>
            )}
            <div className={classes.divDiaSemana}>{DiaSemanaExt}</div>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Hora"
                value={selectedHour}
                onChange={handleHourChange}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                disabled={promiseInProgress}
              />
            </MuiPickersUtilsProvider>
            {HourError && (
              <FormHelperText id="component-error-text" error>
                Indique a Hora
              </FormHelperText>
            )}
          </Grid>
        </Grid>

        <Grid container direction="row" spacing={0} style={{ marginTop: "5%" }}>
          <Grid item xs={2}></Grid>
          <Grid
            item
            xs={10}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <Typography variant="subtitle1">Dias da Semana</Typography>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={segunda}
                  onChange={handleChangeDiasDaSemana}
                  name="segunda"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Segunda
                </Typography>
              }
            />
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={terca}
                  onChange={handleChangeDiasDaSemana}
                  name="terca"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Terça
                </Typography>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={quarta}
                  onChange={handleChangeDiasDaSemana}
                  name="quarta"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Quarta
                </Typography>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={quinta}
                  onChange={handleChangeDiasDaSemana}
                  name="quinta"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Quinta
                </Typography>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sexta}
                  onChange={handleChangeDiasDaSemana}
                  name="sexta"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Sexta
                </Typography>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sabado}
                  onChange={handleChangeDiasDaSemana}
                  name="sabado"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Sabado
                </Typography>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={domingo}
                  onChange={handleChangeDiasDaSemana}
                  name="domingo"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  Domingo
                </Typography>
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}>
            <TextField
              label="Valor Aula"
              name="valor"
              type="number"
              fullWidth
              value={Valor}
              onChange={handleValorChange}
              disabled={Turma.length == 0 || promiseInProgress}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={MarcacaoSemestral}
                  onChange={handleChangeMarcacaoSemestral}
                  name="chkSemestral"
                  color="primary"
                  disabled={promiseInProgress}
                />
              }
              label="Agendar Semestre"
            />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleClickConfirmar}
              disabled={promiseInProgress}
            >
              Salvar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="#e8eaf6"
              size="large"
              startIcon={<CancelPresentationIcon />}
              onClick={() => ClearFields()}
              className={classes.btn}
              disabled={promiseInProgress}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error">
            Não foi possível realizar a operação. Contacte o desenvolvedor
          </Alert>
        </Snackbar>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert onClose={handleClose} severity="success">
            Operação realizada com sucesso!
          </Alert>
        </Snackbar>
      </div>
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
            <h2 id="transition-modal-title">{ModalTitulo}</h2>
            <p id="transition-modal-description">{ModalTexto}</p>
            <Button variant="contained" onClick={() => setopenModal(false)}>
              Fechar
            </Button>
          </div>
        </Fade>
      </Modal>
      <Dialog
        open={openDialogoConf}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Atenção"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {textoConfirmaAgendamento}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConf} color="primary">
            Desistir
          </Button>
          <Button onClick={HandleSaveClick} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
