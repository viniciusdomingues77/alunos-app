import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import InputMask from "react-input-mask";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Box from "@material-ui/core/Box";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
}));
export default function AlunoCadastro() {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <TextField
            id="standard-read-only-input"
            label="N° de Registro"
            defaultValue=""
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Nome" defaultValue="" fullWidth />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Email" defaultValue="" fullWidth />
        </Grid>

        <Grid item xs={3}>
          <MuiThemeProvider>
            <InputMask mask="99/99/9999" disabled={false} maskChar=" ">
              {() => (
                <TextField label="Dt.Nascimento" defaultValue="" fullWidth />
              )}
            </InputMask>
          </MuiThemeProvider>
        </Grid>

        <Grid item xs={4}>
          <MuiThemeProvider>
            <InputMask mask="(99)99999-9999" disabled={false} maskChar=" ">
              {() => (
                <TextField label="Tel.Celular" defaultValue="" fullWidth />
              )}
            </InputMask>
          </MuiThemeProvider>
        </Grid>
        <Grid item xs={4}>
          <MuiThemeProvider>
            <InputMask mask="(99)9999-9999" disabled={false} maskChar=" ">
              {() => <TextField label="Tel.Fixo" defaultValue="" fullWidth />}
            </InputMask>
          </MuiThemeProvider>
        </Grid>
        <Grid item xs={1}></Grid>

        <Grid item xs={6}>
          <TextField label="Endereço" defaultValue="" fullWidth />
        </Grid>
        <Grid item xs={4}>
          <MuiThemeProvider>
            <InputMask mask="99999-999" disabled={false} maskChar=" ">
              {() => <TextField label="CEP" defaultValue="" fullWidth />}
            </InputMask>
          </MuiThemeProvider>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      <div style={{ width: "100%" }}>
        <Box display="flex" flexDirection="row" p={0} m={0}>
          <Box p={0} justifyContent="flex-start">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              Salvar
            </Button>
          </Box>
          <Box p={0}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              Salvar
            </Button>
          </Box>
          <Box p={0}>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}
