import BarraProgressoFixa from "./barraprogressofixa";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { DiaDaSemana } from "./datas";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import { server } from "./server";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(5),
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonupload: {
    marginRight: theme.spacing(5),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  cabecalho: {
    with: "100%",
    height: "10px",
  },
  input: {
    display: "none",
  },
  AlunoFoto: {
    marginTop: theme.spacing(1),
  },
}));

export default function Lancamentos() {
  const [Tipo, setTipo] = React.useState("D");
  const [Valor, setValor] = React.useState(0);
  const [Lancamento, setLancamento] = React.useState("");
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [LancamentoError, setLancamentoError] = React.useState(false);
  const [ValorError, setValorError] = React.useState(false);
  const [DataError, setDataError] = React.useState(false);
  const { promiseInProgress } = usePromiseTracker();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [DiaSemanaExt, setDiaSemanaExt] = React.useState("");
  const [SubmitSuccess, setSubmitSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [textError, settextError] = React.useState("");
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDiaSemanaExt(DiaDaSemana(date));
  };
  const handleChangeTipo = (event) => {
    setTipo(event.target.value);
  };
  const handleChangeValor = (event) => {
    setValor(event.target.value);
  };
  const handleChangeLancamento = (event) => {
    setLancamento(event.target.value);
  };
  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = openSuccess;

  React.useLayoutEffect(() => {
    console.log("promiseInProgress " + promiseInProgress);
    if (!promiseInProgress) {
      if (SubmitSuccess) {
        setOpenSuccess({ open: true, vertical: "top", horizontal: "center" });
      }
      ClearFields();
    }
  }, [promiseInProgress]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess({ open: false, vertical: "top", horizontal: "center" });
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  function handleLancamentoError() {
    if (Lancamento.length <= 3) {
      setLancamentoError(true);
      return true;
    } else {
      setLancamentoError(false);
      return false;
    }
  }

  function handleValorError() {
    if (Valor <= 0) {
      setValorError(true);
      return true;
    } else {
      setValorError(false);
      return false;
    }
  }

  function handleDataError() {
    if (selectedDate == "Invalid Date") {
      setDataError(true);
      return true;
    } else {
      setDataError(false);
      return false;
    }
  }

  function ValidaTodososCampos() {
    var lancamentoerror = handleLancamentoError();
    var valorerror = handleValorError();
    var dataerror = handleDataError();
    if (lancamentoerror || valorerror || dataerror) {
      return false;
    } else {
      return true;
    }
  }

  const submitForm = (event) => {
    event.preventDefault();
    console.log("submit");
    if (!ValidaTodososCampos()) {
      return;
    }
    setTextoBarraProgresso("Cadastrando lançamento");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valor: Valor,
        data: selectedDate,
        descricao: Lancamento,
        tipo: Tipo,
      }),
    };

    trackPromise(
      fetch(server + "/api/financeiro/lancamento", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => {
          console.log(
            "statusCode " + d.statusCode + " reasonPhrase " + d.reasonPhrase
          );
          setSubmitSuccess(true);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setSubmitSuccess(false);
          setOpenError(true);
        })
    );
  };
  const classes = useStyles();
  function ClearFields() {}
  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <form onSubmit={submitForm}>
        <Grid container spacing={3} direction="row" style={{ marginTop: 10 }}>
          <Grid item xs={2}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Lançamento</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={Tipo}
                onChange={handleChangeTipo}
                disabled={promiseInProgress}
              >
                <MenuItem value={"D"}>Débito</MenuItem>
                <MenuItem value={"C"}>Crédito</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={10}>
            <TextField
              name="lancamento"
              // required
              label="Lançamento"
              fullWidth
              value={Lancamento}
              onChange={handleChangeLancamento}
              disabled={promiseInProgress}
            />
            {LancamentoError && (
              <FormHelperText id="component-error-text" error>
                Informe ao menos 5 caracteres
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2} style={{ marginTop: 16 }}>
            <TextField
              name="valor"
              type="number"
              label="Valor"
              value={Valor}
              onChange={handleChangeValor}
              disabled={promiseInProgress}
            />
            {ValorError && (
              <FormHelperText id="component-error-text" error>
                Informe o valor
              </FormHelperText>
            )}
          </Grid>
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
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 40 }}>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
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
              onClick={ClearFields}
              disabled={promiseInProgress}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
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
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          Não foi possível realizar a operação. Erro ´{textError}´
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
