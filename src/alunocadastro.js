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
  const { register, handleSubmit, control } = useForm()

  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2014-08-18T21:11:54')
  )

  // const handleDateChange = date => {
  //   setSelectedDate(date)
  // }
  const classes = useStyles()
  const submitForm = async data => {
    // const result = await postQuestion({ title: data.title,
    //     content: data.content,
    //     userName: 'Fred', created: new Date() });
    console.log('data ' + data.nome)
    console.log('data ' + data.dtnascimento)
    //setSuccessfullySubmitted(result ? true : false)
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
            <MuiThemeProvider>
              <InputMask mask='(99)9999-9999' disabled={false} maskChar=' '>
                {() => <TextField label='Tel.Fixo' name='telfixo' fullWidth />}
              </InputMask>
            </MuiThemeProvider>
          </Grid>
          <Grid item xs={1}></Grid>

          <Grid item xs={6}>
            <TextField label='Endereço' name='endereco' fullWidth />
          </Grid>
          <Grid item xs={4}>
            <MuiThemeProvider>
              <InputMask mask='99999-999' disabled={false} maskChar=' '>
                {() => <TextField label='CEP' name='cep' fullWidth />}
              </InputMask>
            </MuiThemeProvider>
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
