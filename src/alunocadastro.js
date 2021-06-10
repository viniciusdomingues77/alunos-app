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
import { useForm, Controller } from 'react-hook-form'
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
  // type FormData = {
  //   nome: string
  // }
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(
    false
  )
  const { promiseInProgress } = usePromiseTracker()
  const [idAluno, setidAluno] = React.useState(0)
  const [selectedFile, setselectedFile] = React.useState(null)
  const [Saving, setSaving] = React.useState(false)
  //https://www.robinwieruch.de/react-usestate-callback
  const { register, handleSubmit, control, reset } = useForm()

  React.useLayoutEffect(() => {
    if (!promiseInProgress) {
      reset()
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

  const submitForm = (data, event) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idaluno: 0,
        nome: data.nome,
        email: data.email,
        dtnascimento: data.dtnascimento,
        foto: selectedFile,
        telcelular: data.telcelular,
        telfixo: data.telfixo,
        endereco: data.endereco,
        cep: data.cep
      })
    }
    trackPromise(
      fetch('https://localhost:44363/api/aluno/', requestOptions)
        .then(response => response.json())
        .then(d => console.log('data res ' + d))
    )
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
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
                <Controller
                 
                  name='nome'
                  control={control}
                  defaultValue=''
                  rules={{ required: 'O nome é obrigatório' }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      name='nome'
                      required
                      label='Nome'
                      fullWidth
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='email'
                  control={control}
                  defaultValue=''
                  rules={{ required: 'O email é obrigatório' }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      required
                      label='Email'
                      name='email'
                      type='email'
                      fullWidth
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <Controller
                  name='dtnascimento'
                  control={control}
                  defaultValue=''
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    // <MuiThemeProvider>
                    <InputMask
                      mask='99/99/9999'
                      disabled={false}
                      maskChar=' '
                      value={value}
                      onChange={onChange}
                    >
                      {() => (
                        <TextField
                          label='Dt.Nascimento'
                          fullWidth
                          helperText={error ? error.message : null}
                          error={!!error}
                        />
                      )}
                    </InputMask>
                    // </MuiThemeProvider>
                  )}
                />
              </Grid>
              <Grid item xs={1}></Grid>

              <Grid item xs={4}>
                <Controller
                  name='telcelular'
                  control={control}
                  defaultValue=''
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <MuiThemeProvider>
                      <InputMask
                        mask='(99)99999-9999'
                        disabled={false}
                        maskChar=' '
                        value={value}
                        onChange={onChange}
                      >
                        {() => (
                          <TextField
                            label='Tel.Celular'
                            name='telcelular'
                            fullWidth
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      </InputMask>
                    </MuiThemeProvider>
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='telfixo'
                  control={control}
                  defaultValue=''
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <MuiThemeProvider>
                      <InputMask
                        mask='(99)9999-9999'
                        disabled={false}
                        maskChar=' '
                        value={value}
                        onChange={onChange}
                      >
                        {() => (
                          <TextField
                            label='Tel.Fixo'
                            fullWidth
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      </InputMask>
                    </MuiThemeProvider>
                  )}
                />
              </Grid>

              <Grid item xs={8}>
                <Controller
                  name='endereco'
                  control={control}
                  defaultValue=''
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      required
                      label='Endereço'
                      type='text'
                      fullWidth
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name='cep'
                  control={control}
                  defaultValue=''
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <MuiThemeProvider>
                      <InputMask
                        mask='99999-999'
                        disabled={false}
                        maskChar=' '
                        value={value}
                        onChange={onChange}
                      >
                        {() => (
                          <TextField
                            label='CEP'
                            fullWidth
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      </InputMask>
                    </MuiThemeProvider>
                  )}
                />
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            {promiseInProgress && <LinearProgress />}
          </Grid>
          <Grid item xs={12}></Grid>
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
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}
