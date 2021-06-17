import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  titulobarra: {
    margin: 0,
  },
}));
export default function BarraProgresso(props) {
  const classes = useStyles();
  return (
    <LinearProgress />
    // <React.Fragment>
    //   <Grid container spacing={0}>
    //     <Grid item xs={12}>
    //       <LinearProgress />
    //     </Grid>
    //     <Grid item xs={12} className={classes.titulobarra}>
    //       <Typography variant="caption" display="block" gutterBottom>
    //         {props.titulo}
    //       </Typography>
    //     </Grid>
    //   </Grid>
    // </React.Fragment>
  );
}
