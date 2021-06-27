import * as React from "react";
import { DataGrid, ptBR } from "@material-ui/data-grid";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    top: 0,
  },
}));

export default function HistoricoAgendasAluno(props) {
  const [AgendasAluno, setAgendasAluno] = React.useState([]);
  const [FotoAluno, setFotoAluno] = React.useState([]);
  const [openError, setOpenError] = React.useState(false);
  const [select, setSelection] = React.useState([]);
  const [textoExc, settextoExc] = React.useState("");
  const classes = useStyles();
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "strdata", headerName: "Data", width: 110, type: "date" },
    { field: "strhora", headerName: "Hora", width: 110 },
    { field: "diasemana", headerName: "Dia", width: 100 },
  ];
  const [openDialogoExc, setopenDialogoExc] = React.useState(false);
  const handleClickCancelaAgenda = () => {
    setopenDialogoExc(true);
    settextoExc(
      "Todas as agendas selecionadas e seus respectivos prontuários serão deletados. Confirma?"
    );
  };
  const handleCloseExc = (event, reason) => {
    console.log("selecionados  " + select);
    setopenDialogoExc(false);
  };

  const handleClickDelete = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        AgendasdoAluno: select,
      }),
    };
    trackPromise(
      fetch("https://localhost:44363/api/agenda/exclusaorange", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then((d) => console.log(d))
        .catch(function (error) {
          setOpenError(true);
        })
    );
  };

  React.useEffect(() => {
    const apiUrla =
      `https://localhost:44363/api/agenda/todasasagendas/` + props.idaluno;
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
          setAgendasAluno(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
    const apiUrlf = `https://localhost:44363/api/aluno/foto/` + props.idaluno;
    trackPromise(
      fetch(apiUrlf)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFotoAluno(data);
        })
        .catch(function (error) {
          console.log("catch error" + error);
          setOpenError(true);
        })
    );
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Avatar className={classes.avatar} src={FotoAluno.foto}></Avatar>
        </Grid>
        <Grid
          item
          xs={8}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {FotoAluno.nome}
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <IconButton
            color="primary"
            aria-label="Remove Agenda"
            component="span"
            onClick={handleClickCancelaAgenda}
          >
            <EventBusyIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} style={{ marginLeft: 0 }}>
          <div style={{ height: 400, width: "600px" }}>
            <DataGrid
              rows={AgendasAluno}
              columns={columns.map((column) => ({
                ...column,
                sortable: false,
              }))}
              pageSize={5}
              checkboxSelection
              localeText={ptBR.props.MuiDataGrid.localeText}
              onSelectionModelChange={(e) => {
                console.log("e " + e.selectionModel);
                //setSelection(newSelection);
              }}
            />
          </div>
        </Grid>
      </Grid>
      <Dialog
        open={openDialogoExc}
        onClose={handleCloseExc}
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
          <Button onClick={handleCloseExc} color="primary">
            Desistir
          </Button>
          <Button onClick={handleClickDelete} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
