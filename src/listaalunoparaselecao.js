import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import { server } from './server'
import Button from '@material-ui/core/Button'
import { useSelector, useDispatch } from 'react-redux'
import TextBusca from './textbusca'
import {
  action,
  AppState,
  store,
  SetAlunosSelecionadosParaTurmaAction,
  SetSelecionandoAlunosParaTurmaAction
} from './ConfigSate'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 480,
    height: 280,
    overflow: 'scroll',
    marginTop: 20,
    backgroundColor: theme.palette.background.paper
  },
  grid: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.palette.background.paper
  }
}))

export default function CheckboxListAluno () {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([])

  const [AlunoFiltro, setAlunoFiltro] = React.useState('')
  const { promiseInProgress } = usePromiseTracker()
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState('')
  const [Alunos, setAlunos] = React.useState([])
  const SelecionandoAlunosParaTurma = useSelector(
    state => state.configuracoes.SelecionandoAlunosParaTurma
  )
  const RemovendoAlunosParaTurma = useSelector(
    state => state.configuracoes.RemovendoAlunosParaTurma
  )
  const handleAlunoFiltroChange = e => {
    setAlunoFiltro(e.currentTarget.value)
  }
  const dispatch = useDispatch()
  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
    dispatch(SetAlunosSelecionadosParaTurmaAction(newChecked))
  }
  const handleFiltrarAluno = () => {
    setTextoBarraProgresso('Listando alunos')
    const apiUrl = server + '/api/aluno/identificacaocomfoto/' + AlunoFiltro

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
          setAlunos(data)
        })
        .catch(function (error) {
          //console.log("catch error" + error);
          //setOpenError(true);
        })
    )
  }

  function CarregaAlunos () {
    setTextoBarraProgresso('Listando alunos')
    const apiUrl = server + `/api/aluno/identificacaocomfoto/` + AlunoFiltro
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
          setAlunos(data)
        })
        .catch(function (error) {
          //console.log("catch error" + error);
          //setOpenError(true);
        })
    )
  }

  React.useEffect(() => {
    dispatch(SetAlunosSelecionadosParaTurmaAction(''))
    CarregaAlunos()
  }, [])
  React.useEffect(() => {
    if (SelecionandoAlunosParaTurma) {
      CarregaAlunos()
      dispatch(SetSelecionandoAlunosParaTurmaAction(false))
      dispatch(SetAlunosSelecionadosParaTurmaAction(''))
      setChecked([])
    }
  }, [SelecionandoAlunosParaTurma])

  React.useEffect(() => {
    if (RemovendoAlunosParaTurma) {
      CarregaAlunos()
    }
  }, [RemovendoAlunosParaTurma])

  return (
    <Grid container spacing={3} direction='column' className={classes.grid}>
      <Grid container spacing={1} direction='row' style={{ marginLeft: 15 }}>
        <TextBusca
          label={'Aluno'}
          value={AlunoFiltro}
          onChange={handleAlunoFiltroChange}
          disabled={promiseInProgress}
          onClickButton={handleFiltrarAluno}
        />
      </Grid>
      <List dense className={classes.root}>
        {Alunos.map(aluno => {
          const labelId = `checkbox-list-secondary-label-${aluno.idaluno}`
          return (
            <ListItem key={aluno.idaluno} button>
              <ListItemAvatar>
                <Avatar alt={`Aluno`} src={aluno.foto} />
              </ListItemAvatar>
              <ListItemText id={labelId + aluno.idaluno} primary={aluno.nome} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge='end'
                  onChange={handleToggle(aluno.idaluno)}
                  checked={checked.indexOf(aluno.idaluno) !== -1}
                  inputProps={{ 'aria-labelledby': labelId + aluno.idaluno }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    </Grid>
  )
}
