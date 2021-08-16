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
  SetOpenEventoAgendaAction
} from './ConfigSate'

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

export default function DialogoCalendario () {
  const dispatch = useDispatch()
  const open = useSelector(state => state.configuracoes.OpenEventoAgenda)
  const evento = useSelector(state => state.configuracoes.EventoAgenda)

  const handleClickOpen = () => {
    dispatch(SetOpenEventoAgendaAction(true))
  }

  const handleClose = () => {
    dispatch(SetOpenEventoAgendaAction(false))
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
            variant='contained'
            color='primary'
            style={{ fontSize: '10px', width: '60%' }}
          >
            Desmarcado pelo professor
          </Button>
          <Button
            variant='contained'
            color='secondary'
            style={{ fontSize: '10px', width: '60%' }}
          >
            Desmarcado pelo aluno
          </Button>
          <Button
            variant='contained'
            href='#contained-buttons'
            style={{ fontSize: '10px', width: '60%' }}
          >
            Ir para prontuário
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
