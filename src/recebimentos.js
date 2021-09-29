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
import {
  DataparaParametroPar,
  GeratDataJS,
  ConvertDataJSParaDataExtensoComDiadaSemana,
} from "./datas";
import { server } from "./server";
import CheckIcon from "@material-ui/icons/Check";
const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
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

export default function Recebimentos() {
  const { promiseInProgress } = usePromiseTracker();
  const classes = useStyles();
  const [selectedDateIni, setSelectedDateIni] = React.useState(new Date());
  const [selectedDateFim, setSelectedDateFim] = React.useState(new Date());
  const [Recebimentos, setRecebimentos] = React.useState([]);

  const handleDateIniChange = (date) => {
    setSelectedDateIni(date);
  };
  const handleDateFimChange = (date) => {
    setSelectedDateFim(date);
  };

  React.useEffect(() => {}, []);

  function Receber(idlancamento) {
    const apiUrl = server + `/api/financeiro/receber/` + idlancamento;
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
          CarregaRecebimentos();
        })
        .catch(function (error) {
          console.log("catch error" + error);
          //setOpenError(true);
        })
    );
  }

  function CarregaRecebimentos() {
    const apiUrl =
      server +
      `/api/financeiro/recebimentos/` +
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
          setRecebimentos(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          //setOpenError(true);
        })
    );
  }

  function ListaDataRecebimentos(recebimentos) {
    return recebimentos.recebimentos.map((recebimento) => (
      <React.Fragment>
        <TableRow style={{ backgroundColor: "#EDEDED" }}>
          <TableCell colSpan={3} align="left">
            <Grid container spacing={0}>
              <Grid item xs={1}>
                <CalendarTodayIcon />
              </Grid>
              <Grid item xs={11} style={{ marginTop: 5 }}>
                {ConvertDataJSParaDataExtensoComDiadaSemana(
                  GeratDataJS(recebimento.ano, recebimento.mes - 1, recebimento.dia)
                )}
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
        {recebimento.recebimentos.map((rec) => (
          <TableRow>
            <TableCell>{rec.descricao}</TableCell>
            <TableCell>R${rec.valor}</TableCell>
            <TableCell>
              {rec.pago == 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  href="#outlined-buttons"
                  onClick={() => Receber(rec.idlancamento)}
                >
                  <Typography variant="caption">Receber</Typography>
                </Button>
              )}
              {rec.pago == 1 && <CheckIcon color="primary" />}
            </TableCell>
          </TableRow>
        ))}
      </React.Fragment>
    ));
  }

  return (
    <React.Fragment>
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
          <Button variant="contained" onClick={CarregaRecebimentos}>
            Exibir
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <div style={{ height: 800, overflow: "auto" }}>
            <TableContainer>
              <Table className={classes.table} aria-label="spanning table">
                <TableBody>
                  {Recebimentos && (
                    <ListaDataRecebimentos
                      recebimentos={Recebimentos}
                    ></ListaDataRecebimentos>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
