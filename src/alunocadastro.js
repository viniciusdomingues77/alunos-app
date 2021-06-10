import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import SaveIcon from '@material-ui/icons/Save'
import Button from '@material-ui/core/Button'
import InputMask from 'react-input-mask'
import FormHelperText from '@material-ui/core/FormHelperText'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'
import Box from '@material-ui/core/Box'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Avatar from '@material-ui/core/Avatar'
import Fab from '@material-ui/core/Fab'
import blue from '@material-ui/core/colors/blue'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation'
import LinearProgress from '@material-ui/core/LinearProgress'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import MsgSucesso from './msgsucesso'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  buttonupload: {
    marginRight: theme.spacing(5)
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12)
  },

  input: {
    display: 'none'
  },
  AlunoFoto: {
    marginTop: theme.spacing(1)
  }
}))
export default function AlunoCadastro () {
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(
    false
  )
  const { promiseInProgress } = usePromiseTracker()
  const [idAluno, setidAluno] = React.useState(0)
  const [selectedFile, setselectedFile] = React.useState(null)
  const [Saving, setSaving] = React.useState(false)

  React.useLayoutEffect(() => {
    console.log('promiseInProgress ' + promiseInProgress)
    if (!promiseInProgress) {
      ClearFields()
    }
  }, [promiseInProgress])

  function handleUploadClick (event) {
    console.log('handleUploadClick')
    console.log(event.target.files[0])
    console.log('buf' + URL.createObjectURL(event.target.files[0]))
    const reader = new FileReader()
    var file = event.target.files[0]
    reader.onload = event => {
      console.log('buf a :' + event.target.result)
      setselectedFile(event.target.result)
    }

    reader.onerror = err => {}

    reader.readAsDataURL(file)
  }

  const classes = useStyles()

  const submitForm = event => {
    if (!ValidaTodososCampos) {
      return
    }

    event.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idaluno: 0,
        nome: Nome,
        email: Email,
        dtnascimento: DTNascimento,
        foto: selectedFile,
        telcelular: TelCelular,
        telfixo: TelFixo,
        endereco: Endereco,
        cep: CEP
      })
    }
    trackPromise(
      fetch('https://localhost:44363/api/aluno/', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(response => response.json())
        .then(d => console.log('data res ' + d),setSubmitSuccess(true))
        .catch(function (error) {
          console.log('catch error' + error)
          setSubmitSuccess(false)
        })
    )
  }

  function ClearFields () {
    setNome('')
    setEmail('')
    setDTNascimento('')
    setTelCelular('')
    setTelFixo('')
    setEndereco('')
    setCEP('')
    setselectedFile(null)
    setNomeError(false)
    setEmailError(false)
    setDTNascimentoError(false)
    setTelCelularError(false)
  }
  const [SubmitSuccess, setSubmitSuccess] = React.useState(false)

  const [Nome, setNome] = React.useState('')
  const [NomeError, setNomeError] = React.useState(false)
  const [Email, setEmail] = React.useState('')
  const [EmailError, setEmailError] = React.useState(false)
  const [DTNascimento, setDTNascimento] = React.useState('')
  const [DTNascimentoError, setDTNascimentoError] = React.useState(false)
  const [TelCelular, setTelCelular] = React.useState('')
  const [TelCelularError, setTelCelularError] = React.useState(false)
  const [TelFixo, setTelFixo] = React.useState('')
  const [Endereco, setEndereco] = React.useState('')
  const [CEP, setCEP] = React.useState('')

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.currentTarget.value)
  }
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }
  const handleDTNascimentoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDTNascimento(e.currentTarget.value)
  }
  const handleTelCelularChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTelCelular(e.currentTarget.value)
  }
  const handleTelFixoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTelFixo(e.currentTarget.value)
  }
  const handleEnderecoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndereco(e.currentTarget.value)
  }
  const handleCEPChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCEP(e.currentTarget.value)
  }

  function handleNomeError () {
    if (Nome.length <= 5) {
      setNomeError(true)
    } else {
      setNomeError(false)
    }
  }

  function handleEmailError () {
    var validacao = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i
    var result = validacao.test(Email)
    if (result) {
      setEmailError(false)
    } else {
      setEmailError(true)
    }
  }

  function handleDTNascimentoError () {
    var validacao = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    var result = validacao.test(DTNascimento)
    if (result) {
      setDTNascimentoError(false)
    } else {
      setDTNascimentoError(true)
    }
  }

  function handleTelCelularError () {
    var validacao = /^(?:(?:\+|00)?(55)\s?)?(?:(?:\(?[1-9][0-9]\)?)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/
    var result = validacao.test(TelCelular)
    if (result) {
      setTelCelularError(false)
    } else {
      setTelCelularError(true)
    }
  }

  function ValidaTodososCampos () {
    if (NomeError || EmailError || DTNascimentoError || DTNascimentoError) {
      return false
    } else {
      return true
    }
  }

  return (
    <form onSubmit={submitForm}>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Grid
              container
              spacing={3}
              direction='column'
              className={classes.AlunoFoto}
            >
              <Grid item xs={12}>
                <Avatar className={classes.avatar} src={selectedFile}></Avatar>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept='image/*'
                  className={classes.input}
                  id='contained-button-file'
                  multiple
                  type='file'
                  onChange={handleUploadClick}
                />
                <label htmlFor='contained-button-file'>
                  <Fab component='span' className={classes.buttonupload}>
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
                  name='nome'
                  required
                  label='Nome'
                  fullWidth
                  value={Nome}
                  onChange={handleNomeChange}
                  onBlur={handleNomeError}
                />
                {NomeError && (
                  <FormHelperText id='component-error-text' error>
                    Informe ao menos 5 caracteres
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  label='Email'
                  name='email'
                  type='email'
                  fullWidth
                  value={Email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailError}
                />
                {EmailError && (
                  <FormHelperText id='component-error-text' error>
                    Informe um email válido
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={3}>
                <MuiThemeProvider>
                  <InputMask
                    type='date'
                    mask='99/99/9999'
                    disabled={false}
                    maskChar=' '
                    value={DTNascimento}
                    onChange={handleDTNascimentoChange}
                    onBlur={handleDTNascimentoError}
                  >
                    {() => (
                      <TextField label='Dt.Nascimento' fullWidth required />
                    )}
                  </InputMask>
                  {DTNascimentoError && (
                    <FormHelperText id='component-error-text' error>
                      Informe uma data válida
                    </FormHelperText>
                  )}
                </MuiThemeProvider>
              </Grid>
              <Grid item xs={1}></Grid>

              <Grid item xs={4}>
                <MuiThemeProvider>
                  <InputMask
                    mask='(99)99999-9999'
                    disabled={false}
                    maskChar=' '
                    value={TelCelular}
                    onChange={handleTelCelularChange}
                    onBlur={handleTelCelularError}
                  >
                    {() => (
                      <TextField
                        label='Tel.Celular'
                        name='telcelular'
                        fullWidth
                        required
                      />
                    )}
                  </InputMask>
                  {TelCelularError && (
                    <FormHelperText id='component-error-text' error>
                      Informe um telefone celular válido
                    </FormHelperText>
                  )}
                </MuiThemeProvider>
              </Grid>
              <Grid item xs={4}>
                <MuiThemeProvider>
                  <InputMask
                    mask='(99)9999-9999'
                    disabled={false}
                    maskChar=' '
                    value={TelFixo}
                    onChange={handleTelFixoChange}
                  >
                    {() => <TextField label='Tel.Fixo' fullWidth />}
                  </InputMask>
                </MuiThemeProvider>
              </Grid>

              <Grid item xs={8}>
                <TextField
                  label='Endereço'
                  type='text'
                  fullWidth
                  value={Endereco}
                  onChange={handleEnderecoChange}
                />
              </Grid>
              <Grid item xs={4}>
                <MuiThemeProvider>
                  <InputMask
                    mask='99999-999'
                    disabled={false}
                    maskChar=' '
                    value={CEP}
                    onChange={handleCEPChange}
                  >
                    {() => <TextField label='CEP' fullWidth />}
                  </InputMask>
                </MuiThemeProvider>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            {/* {SubmitSuccess && <MsgSucesso />} */}
          </Grid>
          <Grid item xs={12}>
            {promiseInProgress && <LinearProgress />}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              size='large'
              startIcon={<SaveIcon />}
            >
              Salvar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='#e8eaf6'
              size='large'
              startIcon={<CancelPresentationIcon />}
              onClick={ClearFields}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}
