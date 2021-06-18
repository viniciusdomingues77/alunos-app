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
}));
export default function Agendamento() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedHour, setSelectedHour] = React.useState(new Date());
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [Alunos, setAlunos] = React.useState([]);
  const [professores, setProfessores] = React.useState([]);
  const [openError, setOpenError] = React.useState(false);
  const [AlunoError, setAlunoError] = React.useState(false);
  const [DataError, setDataError] = React.useState(false);
  const [HourError, setHourError] = React.useState(false);
  const [ProfessorError, setProfessorError] = React.useState(false);
  const [Aluno, setAluno] = React.useState("");
  const [Professor, setProfessor] = React.useState("");
  const { promiseInProgress } = usePromiseTracker();
  const { openErr } = openError;
  React.useEffect(() => {
    setTextoBarraProgresso("Listando alunos e professores");
    const apiUrl = `https://localhost:44363/api/aluno/identificacao`;
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
          setAlunos(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );

    const apiUrlp = `https://localhost:44363/api/professor`;
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
  }, []);
  function ClearFields() {
    setAluno("");
    setProfessor("");
    setSelectedDate(new Date());
    setSelectedHour(new Date());
  }
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
  };
  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = openSuccess;
  const [SubmitSuccess, setSubmitSuccess] = React.useState(false);
  React.useLayoutEffect(() => {
    console.log("promiseInProgress " + promiseInProgress);
    if (!promiseInProgress) {
      if (SubmitSuccess) {
        setOpenSuccess({ open: true, vertical: "top", horizontal: "center" });
      }
      ClearFields();
    }
  }, [promiseInProgress]);
  function ValidaCampos() {
    var camposinvalidos = false;
    if (Aluno.length == 0) {
      setAlunoError(true);
    } else {
      if (Aluno == "0") {
        setAlunoError(true);
        camposinvalidos = true;
      } else {
        setAlunoError(false);
      }
    }
    if (Professor.length == 0) {
      setProfessorError(true);
      camposinvalidos = true;
      return;
    } else {
      if (Aluno == "0") {
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

  const HandleSaveClick = () => {
    if (!ValidaCampos()) {
      return;
    }
    setSubmitSuccess(false);
    setOpenError(false);
    var idaluno = Aluno.substring(0, Aluno.indexOf("-")).trim();
    var idprofessor = Professor.substring(0, Professor.indexOf("-")).trim();
    console.log("idaluno " + idaluno);
    console.log("idprofessor " + idprofessor);
    console.log("date " + selectedDate);
    console.log("hour " + selectedHour);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idaluno: idaluno,
        idprofessor: idprofessor,
        data: selectedDate,
        hora: selectedHour,
      }),
    };
    setTextoBarraProgresso("Agendando");
    trackPromise(
      fetch("https://localhost:44363/api/agenda/", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => setSubmitSuccess(true))
        .catch(function (error) {
          console.log("catch error" + error);
          setSubmitSuccess(false);
          setOpenError(true);
        })
    );
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
              value={Aluno}
              id="autocomplete"
              onChange={(event, newValue) => {
                setAluno(newValue);
                if (newValue) {
                }
              }}
              options={Alunos.map(
                (aluno) => `${aluno.idaluno} - ${aluno.nome}`
              )}
              getOptionSelected={(option, value) => {
                return option === value;
              }}
              style={{ width: "100%", marginBottom: 5 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aluno"
                  required
                  autoFocus
                  variant="outlined"
                />
              )}
            />
            {AlunoError && (
              <FormHelperText id="component-error-text" error>
                Indique o Aluno
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
                  required
                  autoFocus
                  variant="outlined"
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
              />
            </MuiPickersUtilsProvider>
            {DataError && (
              <FormHelperText id="component-error-text" error>
                Indique a data
              </FormHelperText>
            )}
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
              />
            </MuiPickersUtilsProvider>
            {HourError && (
              <FormHelperText id="component-error-text" error>
                Indique a Hora
              </FormHelperText>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            {/* {promiseInProgress && (
              <BarraProgresso titulo={TextoBarraProgresso} />
            )} */}
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={HandleSaveClick}
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
    </React.Fragment>
  );
}
