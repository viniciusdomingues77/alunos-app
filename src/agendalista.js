import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Avatar from "@material-ui/core/Avatar";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DialogoConfirmacao from "./dialogoconfirmacao";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import BarraProgresso from "./barradeprogresso";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventNoteIcon from "@material-ui/icons/EventNote";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import BarraProgressoFixa from "./barraprogressofixa";
import Aviso from "./aviso";
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  calendar: {
    boxShadow: "5px 10px #888888",
  },
  cabecalho: {
    with: "100%",
    height: "10px",
  },
  table: {
    minHeight: 470,
  },
  roottable: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

export default function AgendaLista() {
  const [valueDay, setValueDay] = React.useState(new Date());
  const [dataExt, setdataExt] = React.useState(DataporExtenso(new Date()));
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [Agendados, setAgendados] = React.useState([]);
  const [openError, setOpenError] = React.useState(false);
  const { promiseInProgress } = usePromiseTracker();
  const [Professor, setProfessor] = React.useState("");
  const [SelAluno, setSelAluno] = React.useState(false);
  const classes = useStyles();
  const ListarAgendas = () => {
    console.log("day " + valueDay.getDate());
    console.log("month " + valueDay.getMonth());
    console.log("year " + valueDay.getFullYear());
  };

  function DataparaParametro() {
    return (
      valueDay.getFullYear() +
      "-" +
      (valueDay.getMonth() + 1) +
      "-" +
      valueDay.getDate()
    );
  }

  function DataparaParametroPar(data) {
    return (
      data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
    );
  }

  function MesporExtenso(nummes) {
    switch (nummes) {
      case 0:
        return "Janeiro";
        break;
      case 1:
        return "Fevereiro";
        break;
      case 2:
        return "Março";
        break;
      case 3:
        return "Abril";
        break;
      case 4:
        return "Maio";
        break;
      case 5:
        return "Junho";
        break;
      case 6:
        return "Julho";
        break;
      case 7:
        return "Agosto";
        break;
      case 8:
        return "Setembro";
        break;
      case 9:
        return "Outubro";
        break;
      case 10:
        return "Novembro";
        break;
      case 11:
        return "Dezembro";
        break;

      default:
    }
  }

  function DataporExtenso(data) {
    var dt =
      data.getDate() +
      " de " +
      MesporExtenso(data.getMonth()) +
      " de " +
      data.getFullYear();
    return dt;
  }
  function onChange(nextValue) {
    setPage(0);
    setValueDay(nextValue);
    setdataExt(DataporExtenso(nextValue));
    var idaluno = "0";
    if (Aluno) {
      if (Aluno.length > 0) {
        idaluno = Aluno.substring(0, Aluno.indexOf("-")).trim();
      }
    }
    var idprofessor = "0";
    if (Professor) {
      if (Professor.length > 0) {
        idprofessor = Professor.substring(0, Professor.indexOf("-")).trim();
      }
    }

    if (nextValue) {
      const apiUrl =
        `https://localhost:44363/api/agenda/agenda/` +
        DataparaParametroPar(nextValue) +
        "/" +
        idaluno +
        "/" +
        idprofessor;
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
            setAgendados(data);
          })
          .catch(function (error) {
            console.log("catch error" + error);
            setOpenError(true);
          })
      );
    }
  }
  const [Alunos, setAlunos] = React.useState([]);
  const [Aluno, setAluno] = React.useState("");
  const [professores, setProfessores] = React.useState([]);
  React.useEffect(() => {
    setTextoBarraProgresso("Listando agendamentos");
    const apiUrla = `https://localhost:44363/api/aluno/identificacao`;
    trackPromise(
      fetch(apiUrla)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAlunos(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );

    const apiUrlp = `https://localhost:44363/api/professor`;
    trackPromise(
      fetch(apiUrlp)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProfessores(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );

    const apiUrl =
      `https://localhost:44363/api/agenda/agenda/` +
      DataparaParametro() +
      "/0/0";
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
          setAgendados(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rows = Agendados;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={6}>
          <Grid item xs={12} style={{ width: "100%", marginBottom: 30 }}>
            <Autocomplete
              value={Aluno}
              id="autocomplete"
              onChange={(event, newValue) => {
                console.log("aluno on change");
                setPage(0);
                setAluno(newValue);
                console.log("aluno on change " + newValue);
                var idaluno = "0";
                if (newValue) {
                  idaluno = newValue.substring(0, newValue.indexOf("-")).trim();
                }
                var idprofessor = "0";
                if (Professor) {
                  if (Professor.length > 0) {
                    idprofessor = Professor.substring(
                      0,
                      Professor.indexOf("-")
                    ).trim();
                  }
                }
                const apiUrl =
                  `https://localhost:44363/api/agenda/agenda/` +
                  DataparaParametroPar(valueDay) +
                  "/" +
                  idaluno +
                  "/" +
                  idprofessor;
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
                      setAgendados(data);
                    })
                    .catch(function (error) {
                      console.log("catch error" + error);
                      setOpenError(true);
                    })
                );
              }}
              options={Alunos.map(
                (aluno) => `${aluno.idaluno} - ${aluno.nome}`
              )}
              getOptionSelected={(option, value) => {
                return option === value;
              }}
              style={{ width: "100%", marginBottom: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aluno"
                  required
                  autoFocus
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <Autocomplete
              value={Professor}
              id="autocomplete"
              onChange={(event, newValue) => {
                setProfessor(newValue);
                if (newValue) {
                }
              }}
              options={professores.map(
                (professor) => `${professor.idprofessor} - ${professor.nome}`
              )}
              getOptionSelected={(option, value) => {
                return option === value;
              }}
              style={{ width: "100%", marginBottom: 0 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Professor"
                  required
                  autoFocus
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={6}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Box boxShadow={3}>
            <Calendar
              onChange={onChange}
              value={valueDay}
              style={classes.calendar}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Typography variant="h5" display="block" gutterBottom>
            {dataExt}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ justifyContent: "flex-start" }}>
          {rows.length == 0 && !promiseInProgress && (
            <Aviso aviso="Não existem alunos agendados para esta data" />
          )}
          {rows.length > 0 && (
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                aria-label="custom pagination table"
              >
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : rows
                  ).map((row) => (
                    <TableRow key={row.idagenda}>
                      <TableCell style={{ width: 70 }}>{row.strhora}</TableCell>
                      <TableCell style={{ width: 70 }}>
                        <Avatar src={row.strfoto}></Avatar>
                      </TableCell>
                      <TableCell align="left" style={{ width: 70 }}>
                        {row.idaluno}
                      </TableCell>
                      <TableCell align="left">{row.aluno}</TableCell>
                      <TableCell align="left">{row.professor}</TableCell>
                      <TableCell style={{ width: 60 }} align="left">
                        <IconButton
                          color="primary"
                          aria-label="Remove Agenda"
                          component="span"
                          //   onClick={() => handleClickOpen(row.idaluno, row.nome)}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={5}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}