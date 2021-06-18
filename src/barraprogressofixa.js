import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  titulobarra: {
    margin: 0,
  },
  linha: {
    backgroundColor: "#3F51B5",
    height: "3px",
  },
}));
export default function BarraProgressoFixa(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          {props.loading && <LinearProgress />}
          {!props.loading && <Divider className={classes.linha} />}
        </Grid>
        <Grid item xs={12} className={classes.titulobarra}>
          <Typography variant="caption" display="block" gutterBottom>
            {props.loading && props.titulo}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
