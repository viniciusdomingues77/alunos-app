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
import CheckboxListAluno from "./listaalunoparaselecao";
import CheckboxListAlunoEnturmado from "./listaalunoparaturma";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  action,
  AppState,
  store,
  SetSelecionandoAlunosParaTurmaAction,
  SetAlunosSelecionadosParaTurmaAction,
  SetTurmaSelecionadaAction,
  RemovendoAlunosParaTurma,
  SetAlunosRemovendodaTurmaAction,
} from "./ConfigSate";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    marginLeft: 50,
  },

  cabecalho: {
    with: "100%",
    height: "10px",
  },
}));
export default function TurmaAluno() {
  const classes = useStyles();
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [Alunos, setAlunos] = React.useState([]);
  const [Turmas, setTurmas] = React.useState([]);
  const [Turma, setTurma] = React.useState("");
  const [TurmaDesc, setTurmaDesc] = React.useState("");
  const [TurmaCodigo, setTurmaCodigo] = React.useState("");
  const { promiseInProgress } = usePromiseTracker();

  const AlunosSelecionadosParaTurma = useSelector(
    (state) => state.configuracoes.AlunosSelecionadosParaTurma
  );

  const AlunosRemovidosdaTurma = useSelector(
    (state) => state.configuracoes.AlunosRemovidosdaTurma
  );
  const [openError, setOpenError] = React.useState(false);
  const { openErr } = openError;
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  const dispatch = useDispatch();
  React.useEffect(() => {
    setTextoBarraProgresso("Listando turmas");
    dispatch(SetTurmaSelecionadaAction(0));
    const apiUrl = server + "/api/turma/";
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
          //console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }, []);

  const EnturmaAluno = () => {
    if (Turma.length == 0) {
      return;
    }
    if (AlunosSelecionadosParaTurma.length == 0) {
      return;
    }
    let Alunos = [];
    if (AlunosSelecionadosParaTurma.toString().indexOf(",") > -1) {
      Alunos = AlunosSelecionadosParaTurma.toString().split(",");
    } else {
      Alunos.push(AlunosSelecionadosParaTurma.toString());
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alunos: Alunos,
        idturma: TurmaCodigo,
      }),
    };
    setTextoBarraProgresso("Enturmando alunos");
    trackPromise(
      fetch(server + "/api/turma/alunos", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => {
          console.log("d " + d);
          dispatch(SetSelecionandoAlunosParaTurmaAction(true));
        })
        .catch(function (error) {
          setOpenError(true);
          // setCancelando(false);
        })
    );
  };

  const DesenturmaAluno = () => {
    if (Turma.length == 0) {
      return;
    }

    if (AlunosRemovidosdaTurma.length == 0) {
      return;
    }

    let Alunos = [];
    if (AlunosRemovidosdaTurma.toString().indexOf(",") > -1) {
      Alunos = AlunosRemovidosdaTurma.toString().split(",");
    } else {
      Alunos.push(AlunosRemovidosdaTurma.toString());
    }

    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alunos: Alunos,
        idturma: TurmaCodigo,
      }),
    };

    setTextoBarraProgresso("Removendo Alunos da turma");
    trackPromise(
      fetch(server + "/api/turma/removeralunosturma", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => {
          console.log("d " + d);
          dispatch(SetAlunosRemovendodaTurmaAction(true));
        })
        .catch(function (error) {
          setOpenError(true);
          // setCancelando(false);
        })
    );
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
        <Grid container spacing={3} direction="row" style={{ height: 200 }}>
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              marginBottom: 70,
            }}
          >
            <Grid
              container
              xs={12}
              style={{
                direction: "column",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Autocomplete
                value={Turma}
                id="autocomplete"
                disabled={promiseInProgress}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setTextoBarraProgresso("Listando alunos da turma");
                    setTurma(newValue);
                    let idturma = newValue
                      .substring(0, newValue.indexOf("-") - 1)
                      .trim();
                    let sizeturmadesc = newValue.length - newValue.indexOf("-");
                    sizeturmadesc = sizeturmadesc + 2;
                    let turmadesc = newValue
                      .substring(newValue.indexOf("-") + 1, sizeturmadesc)
                      .trim();
                    setTurmaCodigo(idturma);
                    setTurmaDesc(turmadesc);
                    dispatch(SetTurmaSelecionadaAction(idturma));
                  } else {
                    setTurma("");
                    setTurmaCodigo("");
                    dispatch(SetTurmaSelecionadaAction(0));
                  }
                }}
                options={Turmas.map(
                  (turma) => `${turma.idturma} - ${turma.turma}`
                )}
                getOptionSelected={(option, value) => {
                  return option === value;
                }}
                style={{ width: "100%", marginBottom: 0 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Turma"
                    autoFocus
                    variant="outlined"
                    disabled={promiseInProgress}
                  />
                )}
              />
              {Turma.length == 0 && (
                <Typography variant="body2" gutterBottom>
                  selecione uma turma
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3} direction="row">
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <Typography variant="h6" component="h6">
              Alunos sem turma
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            {Turma.length > 0 && (
              <Typography variant="h6" component="h6">
                {TurmaDesc}
              </Typography>
            )}
          </Grid>
          <Grid
            item
            xs={5}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <CheckboxListAluno disabled={promiseInProgress} />
          </Grid>
          <Grid
            container
            xs={1}
            style={{
              direction: "column",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <IconButton onClick={EnturmaAluno} disabled={promiseInProgress}>
              <ArrowForwardIosIcon />
            </IconButton>
            <IconButton onClick={DesenturmaAluno} disabled={promiseInProgress}>
              <ArrowBackIosIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={5}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <CheckboxListAlunoEnturmado disabled={promiseInProgress} />
          </Grid>
        </Grid>
      </div>
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
