import React from "react";
import { server } from "./server";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import BarraProgresso from "./barradeprogresso";
import BarraProgressoFixa from "./barraprogressofixa";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },

  cabecalho: {
    with: "100%",
    height: "10px",
  },
}));

export default function TurmaCadastro() {
  const classes = useStyles();
  const { promiseInProgress } = usePromiseTracker();
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [Turma, setTurma] = React.useState("");
  const [TurmaError, setTurmaError] = React.useState(false);
  const [SubmitSuccess, setSubmitSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = openSuccess;
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

  React.useLayoutEffect(() => {
    if (!promiseInProgress) {
      if (SubmitSuccess) {
        setOpenSuccess({ open: true, vertical: "top", horizontal: "center" });
      }
      ClearFields();
    }
  }, [promiseInProgress]);

  const handleTurmaChange = (e) => {
    setTurma(e.currentTarget.value);
  };
  function handleTurmaError() {
    if (Turma.length < 1) {
      setTurmaError(true);
      return true;
    } else {
      setTurmaError(false);
      return false;
    }
  }
  function ValidaTodososCampos() {
    var turmaerror = handleTurmaError();

    if (turmaerror) {
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
    setTextoBarraProgresso("Cadastrando turma");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: Turma,
      }),
    };
    trackPromise(
      fetch(server + "/api/turma/", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => console.log("data res " + d), setSubmitSuccess(true))
        .catch(function (error) {
          console.log("catch error" + error);
          setSubmitSuccess(false);
          setOpenError(true);
        })
    );
  };
  function ClearFields() {
    setTurma("");
    setTurmaError(false);
  }
  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <div className={classes.root}>
        <form onSubmit={submitForm}>
          <Grid container spacing={3}>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <TextField
                name="turma"
                label="Turma"
                fullWidth
                value={Turma}
                onChange={handleTurmaChange}
                disabled={promiseInProgress}
              />
              {TurmaError && (
                <FormHelperText id="component-error-text" error>
                  Informe ao menos 1 caracter
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={2}></Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: 40 }}>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
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
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
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
          Não foi possível realizar a operação. Contacte o desenvolvedor
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
