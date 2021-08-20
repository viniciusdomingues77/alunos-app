import 'date-fns'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { useSelector, useDispatch } from 'react-redux'
import {
  action,
  AppState,
  store,
  SetAbrirEnturmacaoAction,
  SetDataEnturmacaoAction
} from './ConfigSate'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'

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

export default function DialogoEnturmacaoAluno (props) {
  const [open, setOpen] = React.useState(false)
  
  const DataEnturmacao = useSelector(
    state => state.configuracoes.DataEnturmacao
  )
  const AbrirEnturmacao = useSelector(
    state => state.configuracoes.AbrirEnturmacao
  )

  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2014-08-18T21:11:54')
  )

  const handleDateChange = date => {
    setSelectedDate(date)
  }

  const AlunosSelecionadosParaTurma = useSelector(
    state => state.configuracoes.AlunosSelecionadosParaTurma
  )

  const dispatch = useDispatch()
  const handleClickOpen = () => {
    //setOpen(true)
    dispatch(SetAbrirEnturmacaoAction(true))
  }
  const handleClose = () => {
    dispatch(SetAbrirEnturmacaoAction(false))
  }

  const ConfirmacaoEnturmacao = () => {
    dispatch(SetAbrirEnturmacaoAction(false))
    dispatch(SetDataEnturmacaoAction(selectedDate))
  }

  function MensagemEnturmacao () {
    let Mensagem = ''
    if (AlunosSelecionadosParaTurma.toString().indexOf(',') > -1) {
      Mensagem =
        'A partir do presente momento serão associados a este aluno as agendas e lançamentos referentes a turma posteriores a '
    } else {
      Mensagem =
        'A partir de que data o aluno sera enturmado? Este dado é importante para a geração das agendas de acordo com a turma'
    }

    return Mensagem
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={AbrirEnturmacao}
      >
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          Enturmação de Aluno(s)
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{MensagemEnturmacao()}</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin='normal'
              id='date-picker-dialog'
              label='Data'
              format='dd/MM/yyyy'
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
              //disabled={promiseInProgress}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color='secondary'>
            Cancelar
          </Button>
          <Button autoFocus onClick={ConfirmacaoEnturmacao} color='primary'>
            Enturmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
