import React from 'react'
import { server } from './server'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import BarraProgresso from './barradeprogresso'
import BarraProgressoFixa from './barraprogressofixa'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab'
import CheckboxListAluno from './listaalunoparaselecao'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30
  },

  cabecalho: {
    with: '100%',
    height: '10px'
  }
}))
export default function TurmaAluno () {
  const classes = useStyles()
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState('')
  const [Alunos, setAlunos] = React.useState([])
  const [Turmas, setTurmas] = React.useState([])
  const [Turma, setTurma] = React.useState('')
  const [TurmaDesc, setTurmaDesc] = React.useState('')

  const { promiseInProgress } = usePromiseTracker()

  React.useEffect(() => {
    setTextoBarraProgresso('Listando turmas')
    const apiUrl = server + '/api/turma/'
    trackPromise(
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setTurmas(data)
        })
        .catch(function (error) {
          //console.log("catch error" + error);
          //setOpenError(true);
        })
    )
  }, [])

  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <div className={classes.root}>
        <Grid container spacing={3} direction='row'>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginBottom: 70
            }}
          >
            <Autocomplete
              value={Turma}
              id='autocomplete'
              onChange={(event, newValue) => {
                if (newValue) {
                  setTurma(newValue)
                }
              }}
              options={Turmas.map(turma => `${turma.idturma} - ${turma.turma}`)}
              getOptionSelected={(option, value) => {
                return option === value
              }}
              style={{ width: '100%', marginBottom: 0 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Turma'
                  autoFocus
                  variant='outlined'
                  disabled={promiseInProgress}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} direction='row'>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginBottom: 20
            }}
          >
            <Typography variant='h6' component='h6'>
              Alunos sem turma
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3} direction='row'>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}
          >
            <CheckboxListAluno />
          </Grid>

          <Grid
            item
            xs={3}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              variant='outlined'
              color='primary'
              endIcon={<ArrowForwardIosIcon />}
              // onClick={handleFiltrarAluno}
            >
              Enturmar
            </Button>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  )
}
