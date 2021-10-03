import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Button from "@material-ui/core/Button";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import {
  DataparaParametroPar,
  GeratDataJS,
  ConvertDataJSParaDataExtensoComDiadaSemana,
} from "./datas";
import { server } from "./server";
import CheckIcon from "@material-ui/icons/Check";
import CreditoCard from "./cardcreditos";
import DebitoCard from "./carddebito";
import SaldoCard from "./cardsaldo";
import BarraProgressoFixa from "./barraprogressofixa";
import Snackbar from "@material-ui/core/Snackbar";
const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  cabecalho: {
    with: "100%",
    height: "10px",
  },
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function Extrato() {
  const { promiseInProgress } = usePromiseTracker();
  const classes = useStyles();
  const [selectedDateIni, setSelectedDateIni] = React.useState(new Date());
  const [selectedDateFim, setSelectedDateFim] = React.useState(new Date());
  const [Extrato, setExtrato] = React.useState(new Object());
  const [ExtratoCarregado, setExtratoCarregado] = React.useState(false);
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [openError, setOpenError] = React.useState(false);
  const [textError, settextError] = React.useState("");
  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = openSuccess;
  const { openErr } = openError;
  const [SubmitSuccess, setSubmitSuccess] = React.useState(false);

  const handleDateIniChange = (date) => {
    setSelectedDateIni(date);
  };
  const handleDateFimChange = (date) => {
    setSelectedDateFim(date);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess({ open: false, vertical: "top", horizontal: "center" });
  };
  React.useLayoutEffect(() => {
    if (!promiseInProgress) {
      if (SubmitSuccess) {
        setOpenSuccess({ open: true, vertical: "top", horizontal: "center" });
        setSubmitSuccess(false);
      }
    }
  }, [promiseInProgress]);

  function Anular(idlancamento) {
    setTextoBarraProgresso("Anulando lançamento");
    const apiUrl = server + `/api/financeiro/anularlancamento/` + idlancamento;
    trackPromise(
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("data " + data);
          CarregaExtrato();
          setSubmitSuccess(true);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }

  React.useEffect(() => {}, []);

  function CarregaExtrato() {
    setTextoBarraProgresso("Carregando extrato");
    const apiUrl =
      server +
      `/api/financeiro/extrato/` +
      DataparaParametroPar(selectedDateIni) +
      "/" +
      DataparaParametroPar(selectedDateFim);

    trackPromise(
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setExtrato(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }

  function ListaLancamentos(extrato) {
    return extrato.extrato.lancamentodadata.map((lanc) => (
      <React.Fragment>
        <TableRow style={{ backgroundColor: "#EDEDED" }}>
          <TableCell colSpan={3} align="left">
            <Grid container spacing={0}>
              <Grid item xs={1}>
                <CalendarTodayIcon />
              </Grid>
              <Grid item xs={11} style={{ marginTop: 5 }}>
                {ConvertDataJSParaDataExtensoComDiadaSemana(
                  GeratDataJS(lanc.ano, lanc.mes, lanc.dia)
                )}
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
        {lanc.lancamentos.map((lancamento) => (
          <TableRow>
            <TableCell>{lancamento.descricao}</TableCell>
            <TableCell>R${lancamento.valor}</TableCell>
            <TableCell>
              {lancamento.agendanula == 1 && (
                <Button
                  variant="outlined"
                  color="primary"
                  href="#outlined-buttons"
                  disabled={promiseInProgress}
                  onClick={() => Anular(lancamento.idlancamento)}
                >
                  <Typography variant="caption">Anular</Typography>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    ));
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
              margin="normal"
              id="date-picker-dialog"
              label="Data de início"
              format="dd/MM/yyyy"
              value={selectedDateIni}
              onChange={handleDateIniChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              disabled={promiseInProgress}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Data de início"
              format="dd/MM/yyyy"
              value={selectedDateFim}
              onChange={handleDateFimChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              disabled={promiseInProgress}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2} style={{ marginTop: 22 }}>
          <Button
            variant="contained"
            onClick={CarregaExtrato}
            disabled={promiseInProgress}
          >
            Exibir
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          {Extrato.lancamentodadata && (
            <CreditoCard credito={Extrato.creditos} />
          )}
        </Grid>
        <Grid item xs={4}>
          {Extrato.lancamentodadata && <DebitoCard debito={Extrato.debitos} />}
        </Grid>
        <Grid item xs={4}>
          {Extrato.lancamentodadata && <SaldoCard saldo={Extrato.saldo} />}
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <div style={{ height: 600, overflow: "auto" }}>
            <TableContainer>
              <Table className={classes.table} aria-label="spanning table">
                <TableBody>
                  {Extrato.lancamentodadata && (
                    <ListaLancamentos extrato={Extrato}></ListaLancamentos>
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
        <Alert onClose={handleCloseError} severity="error">
          Não foi possível realizar a operação. Erro ´{textError}´
        </Alert>
      </Snackbar>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity="success">
          Operação realizada com sucesso!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
