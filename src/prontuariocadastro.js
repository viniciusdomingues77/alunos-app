import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AgendasAluno from "./gradedatahorario";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Button from "@material-ui/core/Button";
import {
  action,
  AppState,
  store,
  SetIDAlunoSelProntuarioAction,
} from "./ConfigSate";
import ReactDOM from "react-dom";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",

    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  texteditor: {
    backgroundColor: "#282c34",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: "white",
    marginBottom: "5px",
    textAlign: "center",
  },
  wrapperclass: {
    padding: "1rem",
    border: "1px solid #ccc",
  },
  editorclass: {
    backgroundColor: "lightgray",
    padding: "1rem",
    border: "1px solid #ccc",
  },
  toolbarclass: {
    border: "1px solid #ccc",
  },
}));

export default function ProntuarioCadastro() {
  const classes = useStyles();
  const [Alunos, setAlunos] = React.useState([]);
  const [Aluno, setAluno] = React.useState("");
  const [texto, setTexto] = React.useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const idalunosel = useSelector(
    (state) => state.configuracoes.IDAlunoSelProntuario
  );

  const idagendasel = useSelector(
    (state) => state.configuracoes.IDAgendaSelProntuario
  );

  const dispatch = useDispatch();
  const SelIdAluno = (idaluno) => {
    dispatch(SetIDAlunoSelProntuarioAction(idaluno));
  };
  const SalvarProntuario = () => {
    console.log("editor state " + editorState.getCurrentContent());
    console.log(
      "json editor state " +
        JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    var texto = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    alert("idagendasel " + idagendasel);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idagenda: idagendasel,
        texto: texto,
      }),
    };
    trackPromise(
      fetch("https://localhost:44363/api/prontuario/", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => console.log("data res " + d))
        .catch(function (error) {
          console.log("catch error" + error);
          //setSubmitSuccess(false);
          //setOpenError(true);
        })
    );
  };
  React.useEffect(() => {
    //setTextoBarraProgresso("Listando alunos e professores");
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
          //setOpenError(true);
        })
    );

    const apiUrl2 = `https://localhost:44363/api/prontuario?idagenda=40`;
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
          console.log(JSON.parse(data.texto));
          editorState = EditorState.createWithContent(
            convertFromRaw(JSON.parse(data.texto))
          );
        })
        .catch(function (error) {
          console.log("catch error" + error);
          //setOpenError(true);
        })
    );
  }, []);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Autocomplete
            value={Aluno}
            id="autocomplete"
            onChange={(event, newValue) => {
              setAluno(newValue);
              console.log("aluno on change " + newValue);
              var idaluno = "0";
              if (newValue) {
                idaluno = newValue.substring(0, newValue.indexOf("-")).trim();
              }
              SelIdAluno(idaluno);
            }}
            options={Alunos.map((aluno) => `${aluno.idaluno} - ${aluno.nome}`)}
            getOptionSelected={(option, value) => {
              return option === value;
            }}
            style={{ width: "100%", marginBottom: 2 }}
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
        </Grid>
        <Grid item xs={5}>
          <AgendasAluno />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="App">
            <header className={classes.texteditor}>
              Rich Text Editor Example
            </header>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName={classes.wrapperclass}
              editorClassName={classes.editorclass}
              toolbarClassName={classes.toolbarclass}
            />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="#e8eaf6"
            size="large"
            startIcon={<SaveIcon />}
            onClick={SalvarProntuario}
          >
            Salvar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
