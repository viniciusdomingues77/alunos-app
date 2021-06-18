import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  aviso: {
    color: "#3F51B5",
  },
}));
export default function Aviso(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.aviso}>{props.aviso}</Typography>
    </div>
  );
}
