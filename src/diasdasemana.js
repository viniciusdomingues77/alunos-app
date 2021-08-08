import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function DiasDaSemana() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    segunda: true,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    domingo: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { segunda, terca, quarta, quinta, sexta, sabado, domingo } = state;
  //const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Dias da Semana</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={segunda}
                onChange={handleChange}
                name="segunda"
              />
            }
            label="Segunda"
          />
          <FormControlLabel
            control={
              <Checkbox checked={jason} onChange={handleChange} name="terca" />
            }
            label="Terça"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={quarta}
                onChange={handleChange}
                name="quarta"
              />
            }
            label="Quarta"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={quinta}
                onChange={handleChange}
                name="quinta"
              />
            }
            label="Quinta"
          />
          <FormControlLabel
            control={
              <Checkbox checked={sexta} onChange={handleChange} name="sexta" />
            }
            label="Sexta"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={sabado}
                onChange={handleChange}
                name="sabado"
              />
            }
            label="Sábado"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={domingo}
                onChange={handleChange}
                name="domingo"
              />
            }
            label="Domingo"
          />
        </FormGroup>

        {/* <FormHelperText>Be careful</FormHelperText> */}
      </FormControl>
    </div>
  );
}
