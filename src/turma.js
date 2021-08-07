import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import PersonIcon from "@material-ui/icons/Person";
import Box from "@material-ui/core/Box";
import ListIcon from "@material-ui/icons/List";
import TurmaCadastro from "./turmacadastro";
import TurmaAluno from "./turmaaluno";
import TurmaLista from "./turmalista";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      marginLeft: theme.spacing(18),
      marginTop: theme.spacing(3),
      width: theme.spacing(120),
      height: theme.spacing(130),
    },
  },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Turma() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      "aria-controls": `scrollable-force-tabpanel-${index}`,
    };
  }
  return (
    <div className={classes.root}>
      <Paper elevation={1}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
          >
            <Tab
              label="Cadastro de turma"
              icon={<GroupAddIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label="Turmas cadastradas"
              icon={<ListIcon />}
              {...a11yProps(1)}
            />
            <Tab label="Turma/Aluno" icon={<PersonIcon />} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <TurmaCadastro />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TurmaLista />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TurmaAluno />
        </TabPanel>
      </Paper>
    </div>
  );
}
