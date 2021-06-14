import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import InputMask from "react-input-mask";
import FormHelperText from "@material-ui/core/FormHelperText";
import LinearProgress from "@material-ui/core/LinearProgress";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { Alert } from "@material-ui/lab";
import Avatar from "@material-ui/core/Avatar";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonupload: {
    marginRight: theme.spacing(5),
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },

  input: {
    display: "none",
  },
  AlunoFoto: {
    marginTop: theme.spacing(1),
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
}));

export default function AlunoDetalhe() {
  const classes = useStyles();
  const [Nome, setNome] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [DTNascimento, setDTNascimento] = React.useState("");
  const [TelCelular, setTelCelular] = React.useState("");
  const [TelFixo, setTelFixo] = React.useState("");
  const [Endereco, setEndereco] = React.useState("");
  const [CEP, setCEP] = React.useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [Alunos, setAlunos] = React.useState([]);
  const [AlunoSel, setAlunoSel] = React.useState([]);
  const [value, setValue] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const apiUrl = `https://localhost:44363/api/Aluno`;
    trackPromise(
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAlunos(data);
        })
    );
  }, []);

  React.useEffect(() => {
    if (!open) {
      setAlunos([]);
    }
  }, [open]);

  return (
    <div className={classes.root}>
      <Autocomplete
        onChange={(event, newValue) => {
          setAlunoSel(JSON.stringify(newValue));
          console.log("Aluno " + AlunoSel.nome);
        }}
        id="aluno-select"
        style={{ width: 600 }}
        options={Alunos}
        classes={{
          option: classes.option,
        }}
        autoHighlight
        getOptionSelected={(option) => option.idaluno}
        getOptionLabel={(option) => option.nome}
        renderOption={(option) => (
          <React.Fragment>
            <Box
              display="flex"
              flexWrap="nowrap"
              p={0}
              m={0}
              css={{ maxWidth: 600 }}
            >
              <Box p={1}>
                <Avatar className={classes.avatar} src={option.foto}></Avatar>
              </Box>
              <Box p={1}>{option.nome}</Box>
              <Box p={1}>({option.idaluno})</Box>
            </Box>
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Escolha um aluno"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
      />
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Grid
            container
            spacing={3}
            direction="column"
            className={classes.AlunoFoto}
          >
            <Grid item xs={12}>
              <Avatar
                className={classes.avatar}
                // src={selectedFile}
              ></Avatar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <Grid item xs={8}>
            <TextField
              name="nome"
              label="Nome"
              fullWidth
              value={Nome}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              value={Email}
            />
          </Grid>

          <Grid item xs={3}>
            <MuiThemeProvider>
              <InputMask
                type="date"
                mask="99/99/9999"
                disabled={false}
                maskChar=" "
                InputProps={{
                  readOnly: true,
                }}
                value={DTNascimento}
              >
                {() => <TextField label="Dt.Nascimento" fullWidth />}
              </InputMask>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={1}></Grid>

          <Grid item xs={4}>
            <MuiThemeProvider>
              <InputMask
                mask="(99)99999-9999"
                disabled={false}
                maskChar=" "
                value={TelCelular}
                InputProps={{
                  readOnly: true,
                }}
              >
                {() => (
                  <TextField label="Tel.Celular" name="telcelular" fullWidth />
                )}
              </InputMask>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={4}>
            <MuiThemeProvider>
              <InputMask
                mask="(99)9999-9999"
                disabled={false}
                maskChar=" "
                value={TelFixo}
                InputProps={{
                  readOnly: true,
                }}
              >
                {() => <TextField label="Tel.Fixo" fullWidth />}
              </InputMask>
            </MuiThemeProvider>
          </Grid>

          <Grid item xs={8}>
            <TextField
              label="Endereço"
              type="text"
              fullWidth
              value={Endereco}
            />
          </Grid>
          <Grid item xs={4}>
            <MuiThemeProvider>
              <InputMask
                mask="99999-999"
                disabled={false}
                maskChar=" "
                value={CEP}
                InputProps={{
                  readOnly: true,
                }}
              >
                {() => <TextField label="CEP" fullWidth />}
              </InputMask>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {promiseInProgress && <LinearProgress />}
        </Grid>
      </Grid>
      <Grid container spacing={3}>
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
            startIcon={<DeleteForeverIcon />}
            //   onClick={}
          >
            Excluir
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
