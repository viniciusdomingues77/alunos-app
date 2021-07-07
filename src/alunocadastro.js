import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import InputMask from "react-input-mask";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Box from "@material-ui/core/Box";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import blue from "@material-ui/core/colors/blue";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import LinearProgress from "@material-ui/core/LinearProgress";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import BarraProgresso from "./barradeprogresso";
import BarraProgressoFixa from "./barraprogressofixa";
import { server } from "./server";
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
export default function AlunoCadastro() {
  const [successfullySubmitted, setSuccessfullySubmitted] =
    React.useState(false);
  const { promiseInProgress } = usePromiseTracker();
  const [idAluno, setidAluno] = React.useState(0);
  const [selectedFile, setselectedFile] = React.useState(null);
  const [Saving, setSaving] = React.useState(false);
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  React.useLayoutEffect(() => {
    console.log("promiseInProgress " + promiseInProgress);
    if (!promiseInProgress) {
      if (SubmitSuccess) {
        setOpenSuccess({ open: true, vertical: "top", horizontal: "center" });
      }
      ClearFields();
    }
  }, [promiseInProgress]);

  function handleUploadClick(event) {
    console.log("handleUploadClick");
    console.log(event.target.files[0]);
    console.log("buf" + URL.createObjectURL(event.target.files[0]));
    const reader = new FileReader();
    var file = event.target.files[0];
    reader.onload = (event) => {
      console.log("buf a :" + event.target.result);
      setselectedFile(event.target.result);
    };

    reader.onerror = (err) => {};

    reader.readAsDataURL(file);
    event.target.value = null;
  }

  const classes = useStyles();

  const submitForm = (event) => {
    event.preventDefault();
    console.log("submit");
    if (!ValidaTodososCampos()) {
      return;
    }
    setTextoBarraProgresso("Cadastrando aluno");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idaluno: 0,
        nome: Nome,
        email: Email,
        strdtnascimento: DTNascimento,
        foto: selectedFile,
        telcelular: TelCelular,
        telfixo: TelFixo,
        endereco: Endereco,
        cep: CEP,
      }),
    };
    trackPromise(
      fetch(server + "/api/aluno/", requestOptions)
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
    setNome("");
    setEmail("");
    setDTNascimento("");
    setTelCelular("");
    setTelFixo("");
    setEndereco("");
    setCEP("");
    setselectedFile(null);
    setNomeError(false);
    setEmailError(false);
    setDTNascimentoError(false);
    setTelCelularError(false);
  }

  const [SubmitSuccess, setSubmitSuccess] = React.useState(false);

  const [Nome, setNome] = React.useState("");
  const [NomeError, setNomeError] = React.useState(false);
  const [Email, setEmail] = React.useState("");
  const [EmailError, setEmailError] = React.useState(false);
  const [DTNascimento, setDTNascimento] = React.useState("");
  const [DTNascimentoError, setDTNascimentoError] = React.useState(false);
  const [TelCelular, setTelCelular] = React.useState("");
  const [TelCelularError, setTelCelularError] = React.useState(false);
  const [TelFixo, setTelFixo] = React.useState("");
  const [TelFixoError, setTelFixoError] = React.useState(false);
  const [Endereco, setEndereco] = React.useState("");
  const [CEP, setCEP] = React.useState("");
  const [CEPError, setCEPError] = React.useState(false);

  const handleNomeChange = (e) => {
    setNome(e.currentTarget.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.currentTarget.value);
  };
  const handleDTNascimentoChange = (e) => {
    setDTNascimento(e.currentTarget.value);
  };
  const handleTelCelularChange = (e) => {
    setTelCelular(e.currentTarget.value);
  };
  const handleTelFixoChange = (e) => {
    setTelFixo(e.currentTarget.value);
  };
  const handleEnderecoChange = (e) => {
    setEndereco(e.currentTarget.value);
  };
  const handleCEPChange = (e) => {
    setCEP(e.currentTarget.value);
  };

  function handleNomeError() {
    if (Nome.length <= 5) {
      setNomeError(true);
      return true;
    } else {
      setNomeError(false);
      return false;
    }
  }

  function handleEmailError() {
    var validacao =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var result = validacao.test(Email);
    console.log("result" + result);
    console.log("email" + Email);
    if (result) {
      setEmailError(false);
      return false;
    } else {
      setEmailError(true);
      return true;
    }
  }

  function handleDTNascimentoError() {
    var validacao =
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    var result = validacao.test(DTNascimento);
    if (result) {
      setDTNascimentoError(false);
      return false;
    } else {
      setDTNascimentoError(true);
      return true;
    }
  }

  function handleTelCelularError() {
    var validacao =
      /^(?:(?:\+|00)?(55)\s?)?(?:(?:\(?[1-9][0-9]\)?)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;
    var result = validacao.test(TelCelular);
    if (result) {
      setTelCelularError(false);
      return false;
    } else {
      setTelCelularError(true);
      return true;
    }
  }

  function handleTelFixoError() {
    const regex = /[0-9]/;
    var result = regex.test(TelFixo);

    if (!result) {
      setTelFixoError(false);
      return false;
    } else {
      var validacao =
        /^(?:(?:\+|00)?(55)\s?)?(?:(?:\(?[1-9][0-9]\)?)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;
      var result = validacao.test(TelFixo);
      if (result) {
        setTelFixoError(false);
        return false;
      } else {
        setTelFixoError(true);
        return true;
      }
    }
  }

  function handleCEPError() {
    const regex = /[0-9]/;
    var result = regex.test(CEP);

    if (!result) {
      setCEPError(false);
      return false;
    } else {
      var validacao = /[0-9]{5}-[0-9]{3}/;
      var result = validacao.test(CEP);
      if (result) {
        setCEPError(false);
        return false;
      } else {
        setCEPError(true);
        return true;
      }
    }
  }

  function ValidaTodososCampos() {
    console.log("handleCEPError() " + handleCEPError());
    var nomerror = handleNomeError();
    var emailerror = handleEmailError();
    var telcelularerror = handleTelCelularError();
    var dtnascimentoerror = handleDTNascimentoError();
    if (nomerror || emailerror || telcelularerror || dtnascimentoerror) {
      return false;
    } else {
      return true;
    }
  }
  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [openError, setOpenError] = React.useState(false);

  const { vertical, horizontal, open } = openSuccess;
  const { openErr } = openError;

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
        <form onSubmit={submitForm}>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Grid
                container
                spacing={3}
                direction="column"
                className={classes.AlunoFoto}
              >
                <Grid item xs={12} style={{ justifyContent: "center" }}>
                  <Avatar
                    className={classes.avatar}
                    src={selectedFile}
                  ></Avatar>
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                    onChange={handleUploadClick}
                    disabled={promiseInProgress}
                  />
                  <label htmlFor="contained-button-file">
                    <Fab component="span" className={classes.buttonupload}>
                      <CloudUploadIcon />
                    </Fab>
                  </label>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <TextField
                    name="nome"
                    // required
                    label="Nome"
                    fullWidth
                    value={Nome}
                    onChange={handleNomeChange}
                    // onBlur={handleNomeError}
                    disabled={promiseInProgress}
                  />
                  {NomeError && (
                    <FormHelperText id="component-error-text" error>
                      Informe ao menos 5 caracteres
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    //required
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={Email}
                    onChange={handleEmailChange}
                    // onBlur={handleEmailError}
                    disabled={promiseInProgress}
                  />
                  {EmailError && (
                    <FormHelperText id="component-error-text" error>
                      Informe um email válido
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={3}>
                  <MuiThemeProvider>
                    <InputMask
                      type="date"
                      mask="99/99/9999"
                      disabled={false}
                      maskChar=" "
                      value={DTNascimento}
                      onChange={handleDTNascimentoChange}
                      // onBlur={handleDTNascimentoError}
                      disabled={promiseInProgress}
                    >
                      {() => (
                        <TextField
                          label="Dt.Nascimento"
                          fullWidth
                          //required
                          disabled={promiseInProgress}
                        />
                      )}
                    </InputMask>
                    {DTNascimentoError && (
                      <FormHelperText id="component-error-text" error>
                        Informe uma data válida
                      </FormHelperText>
                    )}
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
                      onChange={handleTelCelularChange}
                      // onBlur={handleTelCelularError}
                      disabled={promiseInProgress}
                    >
                      {() => (
                        <TextField
                          label="Tel.Celular"
                          name="telcelular"
                          fullWidth
                          //required
                          disabled={promiseInProgress}
                        />
                      )}
                    </InputMask>
                    {TelCelularError && (
                      <FormHelperText id="component-error-text" error>
                        Informe um telefone celular válido
                      </FormHelperText>
                    )}
                  </MuiThemeProvider>
                </Grid>
                <Grid item xs={4}>
                  <MuiThemeProvider>
                    <InputMask
                      mask="(99)9999-9999"
                      disabled={false}
                      maskChar=" "
                      value={TelFixo}
                      onChange={handleTelFixoChange}
                      disabled={promiseInProgress}
                    >
                      {() => (
                        <TextField
                          label="Tel.Fixo"
                          fullWidth
                          disabled={promiseInProgress}
                        />
                      )}
                    </InputMask>
                    {TelFixoError && (
                      <FormHelperText id="component-error-text" error>
                        Telefone fixo inválido.Este campo não é obrigatório
                      </FormHelperText>
                    )}
                  </MuiThemeProvider>
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    label="Endereço"
                    type="text"
                    fullWidth
                    value={Endereco}
                    onChange={handleEnderecoChange}
                    disabled={promiseInProgress}
                  />
                </Grid>
                <Grid item xs={4}>
                  <MuiThemeProvider>
                    <InputMask
                      mask="99999-999"
                      disabled={false}
                      maskChar=" "
                      value={CEP}
                      onChange={handleCEPChange}
                      disabled={promiseInProgress}
                    >
                      {() => (
                        <TextField
                          label="CEP"
                          fullWidth
                          disabled={promiseInProgress}
                        />
                      )}
                    </InputMask>
                  </MuiThemeProvider>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Snackbar
                open={openError}
                autoHideDuration={6000}
                onClose={handleCloseError}
              >
                <Alert onClose={handleCloseError} severity="error">
                  Não foi possível realizar a operação. Contacte o desenvolvedor
                </Alert>
              </Snackbar>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}></Grid>
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
                startIcon={<CancelPresentationIcon />}
                onClick={ClearFields}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </React.Fragment>
  );
}
