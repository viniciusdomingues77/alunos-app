import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import Button from '@material-ui/core/Button'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Typography from '@material-ui/core/Typography'
import {
  DataparaParametroPar,
  GeratDataJS,
  ConvertDataJSParaDataExtensoComDiadaSemana
} from './datas'
import { server } from './server'
import CheckIcon from '@material-ui/icons/Check'
import CardValor from './cardvalor'
import BarraProgressoFixa from './barraprogressofixa'
import { Alert } from '@material-ui/lab'
import Snackbar from '@material-ui/core/Snackbar'

const TAX_RATE = 0.07

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    maxHeight: '500px'
    //maxWidth:700
  },
  cabecalho: {
    with: '100%',
    height: '10px'
  }
})

function ccyFormat (num) {
  return `${num.toFixed(2)}`
}

function priceRow (qty, unit) {
  return qty * unit
}

function createRow (desc, qty, unit) {
  const price = priceRow(qty, unit)
  return { desc, qty, unit, price }
}

function subtotal (items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0)
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99)
]

const invoiceSubtotal = subtotal(rows)
const invoiceTaxes = TAX_RATE * invoiceSubtotal
const invoiceTotal = invoiceTaxes + invoiceSubtotal

export default function Recebimentos () {
  const { promiseInProgress } = usePromiseTracker()
  const classes = useStyles()
  const [selectedDateIni, setSelectedDateIni] = React.useState(new Date())
  const [selectedDateFim, setSelectedDateFim] = React.useState(new Date())
  const [Recebimentos, setRecebimentos] = React.useState([])
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState('')

  React.useLayoutEffect(() => {
    if (!promiseInProgress) {
      if (SubmitSuccess) {
        setOpenSuccess({ open: true, vertical: 'top', horizontal: 'center' })
        setSubmitSuccess(false)
      }
    }
  }, [promiseInProgress])

  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  })

  const [openError, setOpenError] = React.useState(false)
  const [textError, settextError] = React.useState('')
  const [SubmitSuccess, setSubmitSuccess] = React.useState(false)
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenError(false)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSuccess({ open: false, vertical: 'top', horizontal: 'center' })
  }

  const handleDateIniChange = date => {
    setSelectedDateIni(date)
  }
  const handleDateFimChange = date => {
    setSelectedDateFim(date)
  }
  const { vertical, horizontal, open } = openSuccess
  const { openErr } = openError

  React.useEffect(() => {}, [])

  function Receber (idlancamento) {
    setTextoBarraProgresso('Cadastrando aluno')
    const apiUrl = server + `/api/financeiro/receber/` + idlancamento
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
          CarregaRecebimentos()
          setSubmitSuccess(true)
        })
        .catch(function (error) {
          console.log('catch error' + error)
          setOpenError(true)
          setSubmitSuccess(false)
        })
    )
  }

  function CarregaRecebimentos () {
    setTextoBarraProgresso('Carregando recebimentos')
    const apiUrl =
      server +
      `/api/financeiro/recebimentos/` +
      DataparaParametroPar(selectedDateIni) +
      '/' +
      DataparaParametroPar(selectedDateFim)

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
          setRecebimentos(data)
        })
        .catch(function (error) {
          console.log('catch error' + error)
          setOpenError(true)
        })
    )
  }

  function ListaDataRecebimentos (recebimentos) {
    return recebimentos.recebimentos.map(recebimento => (
      <React.Fragment>
        <TableRow style={{ backgroundColor: '#EDEDED' }}>
          <TableCell colSpan={3} align='left'>
            <Grid container spacing={0}>
              <Grid item xs={1}>
                <CalendarTodayIcon />
              </Grid>
              <Grid item xs={11} style={{ marginTop: 5 }}>
                {ConvertDataJSParaDataExtensoComDiadaSemana(
                  GeratDataJS(
                    recebimento.ano,
                    recebimento.mes - 1,
                    recebimento.dia
                  )
                )}
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
        {recebimento.recebimentos.map(rec => (
          <TableRow>
            <TableCell
              style={{
                width: 620
              }}
            >
              {rec.descricao}
            </TableCell>
            <TableCell
              style={{
                width: 150
              }}
            >
              R${rec.valor}
            </TableCell>
            <TableCell>
              {rec.pago == 0 && (
                <Button
                  variant='outlined'
                  color='primary'
                  href='#outlined-buttons'
                  onClick={() => Receber(rec.idlancamento)}
                  disabled={promiseInProgress}
                >
                  <Typography variant='caption'>Receber</Typography>
                </Button>
              )}
              {rec.pago == 1 && <CheckIcon color='primary' />}
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    ))
  }

  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin='normal'
              id='date-picker-dialog'
              label='Data de início'
              format='dd/MM/yyyy'
              value={selectedDateIni}
              onChange={handleDateIniChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
              disabled={promiseInProgress}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin='normal'
              id='date-picker-dialog'
              label='Data de início'
              format='dd/MM/yyyy'
              value={selectedDateFim}
              onChange={handleDateFimChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
              disabled={promiseInProgress}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2} style={{ marginTop: 22 }}>
          <Button
            variant='contained'
            onClick={CarregaRecebimentos}
            disabled={promiseInProgress}
          >
            Exibir
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          {Recebimentos.recebimentos && (
            <CardValor
              titulo={'Recebido'}
              cor={'#159C80'}
              valor={Recebimentos.recebido}
            />
          )}
        </Grid>
        <Grid item xs={4}>
          {Recebimentos.recebimentos && (
            <CardValor
              titulo={'Em aberto'}
              cor={'#C55C54'}
              valor={Recebimentos.emAberto}
            />
          )}
        </Grid>
        <Grid item xs={4}>
          {Recebimentos.recebimentos && (
            <CardValor
              titulo={'Total período'}
              cor={'#0384F1'}
              valor={Recebimentos.totalPeriodo}
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <div style={{ height: 600, overflow: 'auto' }}>
            <TableContainer>
              <Table className={classes.table} aria-label='spanning table'>
                <TableBody>
                  {Recebimentos.recebimentos && (
                    <ListaDataRecebimentos
                      recebimentos={Recebimentos.recebimentos}
                    ></ListaDataRecebimentos>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>

      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity='error'>
          Não foi possível realizar a operação. Erro ´{textError}´
        </Alert>
      </Snackbar>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity='success'>
          Operação realizada com sucesso!
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}
