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
import EventBusyIcon from "@material-ui/icons/EventBusy";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import HistoricoAgendasAluno from "./agendasdoaluno";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import { action, AppState, store } from "./ConfigSate";
import { server } from "./server";

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
    width: "100%",
    height: "10px",
  },
  table: {
    minHeight: 470,
  },
  roottable: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "3px solid #306898",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  cancelado: {
    color: "red",
  },
  ativo: {
    color: "black",
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
  const [IDAluno, setIDAluno] = React.useState(0);
  const [openModal, setopenModal] = React.useState(false);
  const [carregaPlanilha, setcarregaPlanilha] = React.useState(false);
  const [ModalTexto, setModalTexto] = React.useState("");
  const [ModalTitulo, setModalTitulo] = React.useState("");
  const [textoExc, settextoExc] = React.useState("");
  const classes = useStyles();
  const ListarAgendas = () => {
    console.log("day " + valueDay.getDate());
    console.log("month " + valueDay.getMonth());
    console.log("year " + valueDay.getFullYear());
  };
  const [valueAgendaCancelada, setvalueAgendaCancelada] = React.useState(false);
  const [Exclusao, setExclusao] = React.useState(false);
  const AgendaCancelada = useSelector(
    (state) => state.configuracoes.AgendaCancelada
  );

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

  const handleClose = () => {
    setopenDialogoExc(false);
  };
  function MesporExtenso(nummes) {
    switch (nummes) {
      case 0:
        return "Janeiro";

      case 1:
        return "Fevereiro";

      case 2:
        return "Março";

      case 3:
        return "Abril";

      case 4:
        return "Maio";

      case 5:
        return "Junho";

      case 6:
        return "Julho";

      case 7:
        return "Agosto";

      case 8:
        return "Setembro";

      case 9:
        return "Outubro";

      case 10:
        return "Novembro";

      case 11:
        return "Dezembro";
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
    setTextoBarraProgresso("Listando agendamentos");
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
        server +
        "/api/agenda/agenda/" +
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
            setdataExt(DataporExtenso(nextValue));
          })
          .catch(function (error) {
            console.log("catch error" + error);
            setOpenError(true);
          })
      );
    }
  }
  React.useEffect(() => {
    if (carregaPlanilha == true) {
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
      setTextoBarraProgresso("Listando agendamentos");
      const apiUrl =
        server +
        `/api/agenda/agenda/` +
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
            setcarregaPlanilha(false);
          })
          .catch(function (error) {
            console.log("catch error" + error);
            setOpenError(true);
            setcarregaPlanilha(false);
          })
      );

      setvalueAgendaCancelada(false);
    }
  }, [carregaPlanilha]);

  React.useEffect(() => {
    var idaluno = "0";

    if (AgendaCancelada === true) {
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

      setTextoBarraProgresso("Listando agendamentos");
      const apiUrl =
        server +
        `/api/agenda/agenda/` +
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
            setcarregaPlanilha(false);
          })
          .catch(function (error) {
            console.log("catch error" + error);
            setOpenError(true);
            setcarregaPlanilha(false);
          })
      );
    }
  }, [AgendaCancelada]);

  const [openDialogoExc, setopenDialogoExc] = React.useState(false);
  const [Alunos, setAlunos] = React.useState([]);
  const [Aluno, setAluno] = React.useState(null);
  const [professores, setProfessores] = React.useState([]);
  const [Agendas, setAgendas] = React.useState([]);
  const [openAgendasAluno, setopenAgendasAluno] = React.useState(false);
  React.useEffect(() => {
    setTextoBarraProgresso("Listando agendamentos");
    const apiUrla = server + `/api/aluno/identificacao`;
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

    const apiUrlp = server + `/api/professor`;
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
      server + `/api/agenda/agenda/` + DataparaParametro() + "/0/0";
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
  const handleCloseModal = (event, reason) => {
    setopenModal(false);
  };
  const [valueCancelamento, setValueCancelamento] = React.useState("");
  const [valueIDAgendaCancelamento, setIDAgendaCancelamento] =
    React.useState(0);
  const [valueIDAgendaExclusao, setvalueIDAgendaExclusao] = React.useState(0);

  function handleClickCancelaAgenda(idagenda) {
    setIDAgendaCancelamento(idagenda);
    setModalTitulo("Desmarcação");
    setopenModal(true);
    setValueCancelamento("professor");
  }
  function handleClickCancelaAgendaConfirmacao() {
    console.log("valueCancelamento " + valueCancelamento);
    console.log("idagenda " + valueIDAgendaCancelamento);
    setvalueAgendaCancelada(false);
    setopenModal(false);

    setTextoBarraProgresso("Desmarcando");

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idagenda: valueIDAgendaCancelamento,
        stropcao: valueCancelamento,
      }),
    };
    trackPromise(
      fetch(server + "/api/agenda/desmarcacao", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => setcarregaPlanilha(true), setvalueAgendaCancelada(true))
        .catch(function (error) {
          setvalueAgendaCancelada(false);
          setOpenError(true);
        })
    );
  }

  const handleRadioChangeCancelamento = (event) => {
    setvalueAgendaCancelada(false);
    setValueCancelamento(event.target.value);
  };

  function RetornaClasseAgenda(cancelado) {
    var classe = "";

    if (cancelado > 0) {
      classe = classes.cancelado;
    } else {
      classe = classes.ativo;
    }

    return classe;
  }
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  const handleCloseAgendasAluno = () => {
    setopenAgendasAluno(false);
  };
  const handleClickAgendasAluno = () => {
    setopenAgendasAluno(true);
  };
  const handleClickDelete = () => {
    setopenDialogoExc(false);
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    trackPromise(
      fetch(
        server + "/api/agenda/exclusao/" + valueIDAgendaExclusao,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          setExclusao(true);
          setcarregaPlanilha(true);

          return response;
        })
        .then((response) => response.json())
        .then((d) => setExclusao(true))
        .catch(function (error) {
          console.log("catch error" + error);

          setOpenError(true);
        })
    );
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
                setIDAluno(idaluno);
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
                  server +
                  `/api/agenda/agenda/` +
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
                  autoFocus
                  variant="outlined"
                  disabled={promiseInProgress}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}></Grid>
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
                setPage(0);
                var idprofessor = "0";
                if (newValue) {
                  idprofessor = newValue
                    .substring(0, newValue.indexOf("-"))
                    .trim();
                }
                var idaluno = "0";
                if (Aluno) {
                  if (Aluno.length > 0) {
                    idaluno = Aluno.substring(0, Aluno.indexOf("-")).trim();
                  }
                }
                const apiUrl =
                  server +
                  `/api/agenda/agenda/` +
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
                  autoFocus
                  variant="outlined"
                  disabled={promiseInProgress}
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 30,
              marginLeft: 10,
            }}
          >
            {Aluno != null && (
              <Link href="#" onClick={handleClickAgendasAluno}>
                Agendas do aluno
              </Link>
            )}
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
                      <TableCell
                        style={{
                          width: 70,
                        }}
                        className={RetornaClasseAgenda(row.cancelado)}
                      >
                        {row.strhora}
                      </TableCell>
                      <TableCell style={{ width: 70 }}>
                        <Avatar src={row.strfoto}></Avatar>
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ width: 70 }}
                        className={RetornaClasseAgenda(row.cancelado)}
                      >
                        {row.idaluno}
                      </TableCell>
                      <TableCell
                        align="left"
                        className={RetornaClasseAgenda(row.cancelado)}
                      >
                        {row.aluno}
                      </TableCell>
                      <TableCell
                        align="left"
                        className={RetornaClasseAgenda(row.cancelado)}
                      >
                        {row.professor}
                      </TableCell>
                      <TableCell style={{ width: 60 }} align="left">
                        {row.cancelado == 0 && (
                          <IconButton
                            color="primary"
                            aria-label="Remove Agenda"
                            component="span"
                            disabled={promiseInProgress || carregaPlanilha}
                            onClick={() =>
                              handleClickCancelaAgenda(row.idagenda)
                            }
                          >
                            <EventBusyIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      {/* <TableCell style={{ width: 60 }} align='left'>
                        {row.cancelado == 0 && (
                          <IconButton
                            color='primary'
                            aria-label='Remove Agenda'
                            component='span'
                            disabled={promiseInProgress || carregaPlanilha}
                            onClick={() => {
                              setopenDialogoExc(true)
                              setvalueIDAgendaExclusao(row.idagenda)
                              settextoExc(
                                'Confirma a exclusão da aula às ' +
                                  row.strhora +
                                  ' agendado para o aluno ' +
                                  row.aluno +
                                  ' com o professor ' +
                                  row.professor +
                                  ' ? '
                              )
                            }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        )}
                      </TableCell> */}
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{ModalTitulo}</h2>
            <p id="transition-modal-description">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={valueCancelamento}
                onChange={handleRadioChangeCancelamento}
              >
                <FormControlLabel
                  value="professor"
                  control={<Radio />}
                  label="Desmarcado pelo professor"
                />
                <FormControlLabel
                  value="aluno"
                  control={<Radio />}
                  label="Desmarcado pelo aluno"
                />
              </RadioGroup>
            </p>
            <Grid container spacing={3}>
              <Grid
                item
                xs={6}
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleClickCancelaAgendaConfirmacao()}
                >
                  Desmarcar
                </Button>
              </Grid>
              <Grid
                item
                xs={6}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button variant="contained" onClick={() => setopenModal(false)}>
                  Fechar
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          Não foi possível realizar a operação. Contacte o desenvolvedor
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialogoExc}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Atenção"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {textoExc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Desistir
          </Button>
          <Button onClick={handleClickDelete} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseAgendasAluno}
        aria-labelledby="simple-dialog-title"
        open={openAgendasAluno}
      >
        <DialogTitle id="simple-dialog-title" disableTypography>
          <Grid container spacing={3}>
            <Grid
              item
              xs={8}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" display="block" gutterBottom>
                Agendas do aluno
              </Typography>
            </Grid>

            <Grid
              item
              xs={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <IconButton
                color="default"
                aria-label="Fechar"
                component="span"
                onClick={handleCloseAgendasAluno}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContentText>
          <HistoricoAgendasAluno idaluno={IDAluno} />
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}
