import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { yellow } from "@material-ui/core/colors";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
export default function Agendamento() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState("");
  const [Alunos, setAlunos] = React.useState([]);
  const [openError, setOpenError] = React.useState(false);
  React.useEffect(() => {
    setTextoBarraProgresso("Listando alunos");
    const apiUrl = `https://localhost:44363/api/aluno/identificacao`;
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [Aluno, setAluno] = React.useState("");
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Data"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Hora"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
            <Grid item xs={2}></Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <Autocomplete
                value={Aluno}
                id="autocomplete"
                onChange={(event, newValue) => {
                  setAluno(newValue);
                  if (newValue) {
                  }
                }}
                options={Alunos.map(
                  (aluno) => `${aluno.idaluno} - ${aluno.nome}`
                )}
                getOptionSelected={(option, value) => {
                  return option === value;
                }}
                style={{ width: "100%", marginBottom: 32 }}
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
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
    </div>
  );
}
