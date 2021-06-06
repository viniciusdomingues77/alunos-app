import React from "react";
import Divider from "@material-ui/core/Divider";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: "1%",
  },

  paper: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: 0,
    width: "80%",
  },
  tabela: {
    padding: theme.spacing(2),
  },
  coluna: {
    color: theme.palette.text.secondary,
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  topico: {
    color: "#E24A3B",
    fontWeight: "fontWeightBold",
    fontSize: 20,
  },
  questao: {
    color: "#2E92D9",
    fontSize: 15,
  },
  legenda: {
    fontWeight: "fontWeightBold",
    color: theme.palette.text.secondary,
    fontSize: 10,
  },
  semestre: {
    fontWeight: "fontWeightBold",
    fontSize: 12,
  },
  resposta: {
    fontWeight: "fontWeightBold",
    fontSize: 12,
  },
  titulo: {
    fontWeight: "fontWeightBold",
    fontSize: 20,
    color: theme.palette.text.secondary,
  },
}));
export default function CabecalhoModulo(props) {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.titulo}>{props.titulo}</Typography>
      <Divider />
    </div>
  );
}
