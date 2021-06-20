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
import LinearProgress from "@material-ui/core/LinearProgress";
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
import BarraProgressoFixa from "./barraprogressofixa";
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

// const rows = Alunos
// .sort((a, b) => (a.calories < b.calories ? -1 : 1));

const useStyles2 = makeStyles({
  table: {
    minHeight: 490,
  },
  cabecalho: {
    width: "100%",
    height: "10px",
  },
});

export default function AlunosLista() {
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };
  const [openDialogoExc, setopenDialogoExc] = React.useState(false);
  const { promiseInProgress } = usePromiseTracker();
  const [Alunos, setAlunos] = React.useState([]);
  const [textoExc, settextoExc] = React.useState("");
  const [idalunoExc, setidalunoExc] = React.useState(0);
  const [Exclusao, setExclusao] = React.useState(false);
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  function handleClickOpen(idaluno, nome) {
    settextoExc(
      "Confirma a exclusão de " +
        nome +
        " ? \r\n A exclusão não será realizada caso o aluno ja possua registro na agenda."
    );
    setopenDialogoExc(true);
    setidalunoExc(idaluno);
  }

  const handleConfimrExclusao = () => {
    setExclusao(false);
    console.log("handleConfimrExclusao");
    console.log("handleConfimrExclusao idalunoExc " + idalunoExc);
    setopenDialogoExc(false);
    setTextoBarraProgresso("Excluindo aluno");
    console.log("handleConfimrExclusao chama api");
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idaluno: idalunoExc,
      }),
    };
    trackPromise(
      fetch(
        "https://localhost:44363/api/aluno/deletar/" + idalunoExc,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          setExclusao(true);
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

  const handleClose = () => {
    setopenDialogoExc(false);
  };
  const [openError, setOpenError] = React.useState(false);
  const { openErr } = openError;
  const rows = Alunos;
  React.useEffect(() => {
    setTextoBarraProgresso("Carregando alunos");
    const apiUrl = `https://localhost:44363/api/Aluno`;
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
          setAlunos(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }, []);

  React.useEffect(() => {
    console.log("effect exc " + Exclusao);
    if (Exclusao) {
      setTextoBarraProgresso("Carregando alunos");
      const apiUrl = `https://localhost:44363/api/Aluno`;
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
            setAlunos(data);
          })
          .catch(function (error) {
            console.log("catch error" + error);
            setOpenError(true);
          })
      );
    }
  }, [Exclusao]);

  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
      {rows.length == 0 && !promiseInProgress && "Nenhum aluno para exibição"}

      {rows.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
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
                    <TableRow key={row.idaluno}>
                      <TableCell style={{ width: 70 }}>
                        <Avatar src={row.foto}></Avatar>
                      </TableCell>
                      <TableCell align="left" style={{ width: 70 }}>
                        {row.idaluno}
                      </TableCell>
                      <TableCell align="left">{row.nome}</TableCell>
                      <TableCell align="left">{row.telcelular}</TableCell>
                      <TableCell style={{ width: 160 }} align="left">
                        {row.email}
                      </TableCell>
                      <TableCell style={{ width: 60 }} align="left">
                        <IconButton
                          color="primary"
                          aria-label="Remove Aluno"
                          component="span"
                          onClick={() => handleClickOpen(row.idaluno, row.nome)}
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
          </Grid>
        </Grid>
      )}
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
          <Button onClick={handleConfimrExclusao} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          Não foi possível realizar a operação. Contacte o desenvolvedor
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
