import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { ConvertDataJSParaDataExtenso, HoraFormatada } from './datas'
import { useSelector, useDispatch } from 'react-redux'
import {
  action,
  AppState,
  store,
  SetOpenEventoAgendaAction,
  SetCalendarioAtualizarAction,
  SetProntuarioAbaAction,
  SetIDAgendaSelProntuarioTurmaAction,
  SetDataSelProntuarioTurmaAction,
  SetHoraSelProntuarioTurmaAction,
  SetIDAgendaSelProntuarioAction,
  SetDataSelProntuarioAction,
  SetHoraSelProntuarioAction,
  SetIDTurmaSelProntuarioAction,
  SetNomeTurmaSelProntuarioAction,
  SetIDAlunoSelProntuarioAction,
  SetNomeAlunoSelProntuarioAction
} from './ConfigSate'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import { server } from './server'
import { useHistory } from 'react-router-dom'

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
})

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions)

export default function DialogoCalendario (props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const open = useSelector(state => state.configuracoes.OpenEventoAgenda)
  const evento = useSelector(state => state.configuracoes.EventoAgenda)
  const { promiseInProgress } = usePromiseTracker()

  const handleClickOpen = () => {
    dispatch(SetOpenEventoAgendaAction(true))
  }

  const handleClose = () => {
    dispatch(SetOpenEventoAgendaAction(false))
  }

  function DesmarcacaoProfessor () {
    var requestOptions = []
    var url = ''

    if (evento.resourceId.origem == 'aluno') {
      requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idagenda: evento.resourceId.id,
          stropcao: 'professor'
        })
      }
      url = server + '/api/agenda/desmarcacao'
    } else {
      requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idagendaturma: evento.resourceId.id
        })
      }
      url = server + '/api/agenda/desmarcacaoturma'
    }

    trackPromise(
      fetch(url, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(response => response.json())
        .then(
          d => dispatch(SetOpenEventoAgendaAction(false)),
          dispatch(SetCalendarioAtualizarAction(true)),
          dispatch(SetOpenEventoAgendaAction(false))
        )
        .catch(function (error) {
          dispatch(SetOpenEventoAgendaAction(false))
          props.setOpenError(true)
        })
    )
  }

  function DirecionaParaProntuario () {
    dispatch(SetOpenEventoAgendaAction(false))
    if (evento.resourceId.origem == 'aluno') {
      dispatch(SetProntuarioAbaAction(0))
      dispatch(SetIDAgendaSelProntuarioAction(evento.resourceId.id))
      dispatch(SetDataSelProntuarioAction(new Date(evento.start)))
      dispatch(SetHoraSelProntuarioAction(HoraFormatada(evento.start)))
      let aluno = evento.resourceId.idident + ' - ' + evento.title
      dispatch(SetIDAlunoSelProntuarioAction(evento.resourceId.idident))
      dispatch(SetNomeAlunoSelProntuarioAction(aluno))
    } else {
      dispatch(SetProntuarioAbaAction(1))
      dispatch(SetIDAgendaSelProntuarioTurmaAction(evento.resourceId.id))
      dispatch(SetDataSelProntuarioTurmaAction(new Date(evento.start)))
      dispatch(SetHoraSelProntuarioTurmaAction(HoraFormatada(evento.start)))
      dispatch(SetIDTurmaSelProntuarioAction(evento.resourceId.idident))
      let turma = evento.resourceId.idident + ' - ' + evento.title
      dispatch(SetNomeTurmaSelProntuarioAction(turma))
    }
    history.push('/prontuario')
  }

  function DesmarcarAluno () {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idagenda: evento.resourceId.id,
        stropcao: 'aluno'
      })
    }

    trackPromise(
      fetch(server + '/api/agenda/desmarcacao', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(response => response.json())
        .then(
          d => dispatch(SetOpenEventoAgendaAction(false)),
          dispatch(SetCalendarioAtualizarAction(true)),
          dispatch(SetOpenEventoAgendaAction(false))
        )
        .catch(function (error) {
          props.setOpenError(true)
          dispatch(SetOpenEventoAgendaAction(false))
        })
    )
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          Agenda
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {evento.title} em {ConvertDataJSParaDataExtenso(evento.start)} às{' '}
            {HoraFormatada(evento.start)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={DesmarcacaoProfessor}
            variant='contained'
            color='primary'
            style={{ fontSize: '10px' }}
          >
            Desmarcado pelo professor
          </Button>

          {evento.resourceId.origem == 'aluno' && (
            <Button
              variant='contained'
              color='secondary'
              style={{ fontSize: '10px' }}
              onClick={DesmarcarAluno}
            >
              Desmarcado pelo aluno
            </Button>
          )}
          <Button
            variant='contained'
            href='#contained-buttons'
            style={{ fontSize: '10px' }}
            onClick={DirecionaParaProntuario}
          >
            Direcionar para prontuário
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
