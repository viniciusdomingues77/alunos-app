import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CabecalhoModulo from "./titulomodulo";
import AlunosLista from "./alunoslista";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ListIcon from "@material-ui/icons/List";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import AlunoCadastro from "./alunocadastro";
import PersonIcon from "@material-ui/icons/Person";
import AlunoDetalhe from "./alunodetalhe";
import DateRangeIcon from "@material-ui/icons/DateRange";
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import Agendamento from "./agendamentoaluno";
import AgendaLista from "./agendalista";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import AgendamentoTurma from "./agendamentoturma";
import EventIcon from "@material-ui/icons/Event";
import Calendario from "./calendario";
import CreditCardRoundedIcon from "@material-ui/icons/CreditCardRounded";
import MoneyOffRoundedIcon from "@material-ui/icons/MoneyOffRounded";
import CardMembershipIcon from "@material-ui/icons/CardMembership";
import Recebimentos from "./recebimentos";
import Lancamentos from "./lancamentos";
import Extrato from "./extrato";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

    flexWrap: "wrap",
    "& > *": {
      marginLeft: theme.spacing(18),
      marginTop: theme.spacing(0),
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
export default function Financeiro() {
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
              label="Recebimentos"
              icon={<CreditCardRoundedIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label="Lançamentos"
              icon={<MoneyOffRoundedIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label="Extrato"
              icon={<CardMembershipIcon />}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} spacing={0} m={0} p={0}>
          <Recebimentos />
        </TabPanel>
        <TabPanel value={value} index={1} spacing={0} m={0} p={0}>
          <Lancamentos />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Extrato />
        </TabPanel>
      </Paper>
    </div>
  );
}
