import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",

    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export default function ProntuarioCadastro() {
  const classes = useStyles();

  const tileData = [
    {
      data: "01/01/2021",
      hora: "09:00",
      diasemana: "segunda",
    },
    {
      data: "10/01/2021",
      hora: "13:00",
      diasemana: "quarta",
    },
    {
      data: "09/02/2021",
      hora: "17:00",
      diasemana: "quinta",
    },
    {
      data: "11/02/2021",
      hora: "15:00",
      diasemana: "sexta",
    },
    {
      data: "20/02/2021",
      hora: "18:00",
      diasemana: "terça",
    },
    {
      data: "26/02/2021",
      hora: "19:00",
      diasemana: "segunda",
    },
  ];

  return <div className={classes.root}></div>;
}
