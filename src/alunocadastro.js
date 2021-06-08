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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  }
}))
export default function AlunoCadastro () {
  // type FormData = {
  //   nome: string
  // }
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(
    false
  )

  const [idAluno, setidAluno] = React.useState(0)
  const { register, handleSubmit, control } = useForm()

  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2014-08-18T21:11:54')
  )

  // const handleDateChange = date => {
  //   setSelectedDate(date)
  // }
  const classes = useStyles()
  const submitForm = async data => {
    console.log('data.nome ' + data.nome)
    console.log('data.dtnascimento ' + data.dtnascimento)
    console.log('data.email ' + data.email)
    console.log('data.telcelular ' + data.telcelular)
    console.log('data.telfixo ' + data.telfixo)
    console.log('data.endereco ' + data.endereco)
    console.log('data.cep ' + data.cep)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idaluno: 0,
        nome: data.nome,
        email: data.email,
        dtnascimento: data.dtnascimento,
        foto: 'string',
        telcelular: data.telcelular,
        telfixo: data.telfixo,
        endereco: data.endereco,
        cep: data.cep
      })
    }

    fetch('https://localhost:44363/api/aluno/', requestOptions)
      .then(response => response.json())
      .then(data => console.log('data res ' + data))
  }
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <TextField
              label='N° de Registro'
              defaultValue=''
              InputProps={{
                readOnly: true
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
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
                  required
                  label='Nome'
                  name='nome'
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
                <MuiThemeProvider>
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
                        name='dtnascimento'
                      />
                    )}
                  </InputMask>
                </MuiThemeProvider>
              )}
            />
          </Grid>

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
                        name='telfixo'
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
          <Grid item xs={1}></Grid>

          <Grid item xs={6}>
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
                  name='endereco'
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
                        name='cep'
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
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <div style={{ width: '100%' }}>
          <Box display='flex' flexDirection='row' p={0} m={0}>
            <Box p={0} justifyContent='flex-start'>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Salvar
              </Button>
            </Box>
            <Box p={0}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Salvar
              </Button>
            </Box>
            <Box p={0}>
              <Button
                variant='contained'
                color='default'
                className={classes.button}
                startIcon={<CloudUploadIcon />}
              >
                Upload
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </form>
  )
}
