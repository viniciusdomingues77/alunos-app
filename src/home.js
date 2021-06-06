import logo from "./logomarcio.jpg";
import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  logo: {
    width: "10%",
  },
}));
export default function Home() {
  const classes = useStyles();
  return <img src={logo} alt="Logo" className={classes.logo} />;
}
