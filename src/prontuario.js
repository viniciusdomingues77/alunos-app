import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import CabecalhoModulo from './titulomodulo'
import AlunosLista from './alunoslista'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import ListIcon from '@material-ui/icons/List'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import ProntuarioCadastro from './prontuariocadastro'
import ProntuarioCadastroTurma from './prontuariocadastroturma'
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined'
import { useSelector, useDispatch } from 'react-redux'
import { action, AppState, store, SetProntuarioAbaAction } from './ConfigSate'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',

    flexWrap: 'wrap',
    '& > *': {
      marginLeft: theme.spacing(18),
      marginTop: theme.spacing(0),
      width: theme.spacing(120),
      height: theme.spacing(130)
    }
  }
}))

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
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
  )
}

export default function Prontuario () {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const dispatch = useDispatch()
  const ProntuarioAba = useSelector(state => state.configuracoes.ProntuarioAba)

  const handleChange = (event, newValue) => {
    //setValue(newValue);
    dispatch(SetProntuarioAbaAction(newValue))
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  }
  function a11yProps (index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`
    }
  }
  return (
    <div className={classes.root}>
      <Paper elevation={1}>
        <AppBar position='static' color='default'>
          <Tabs
            value={ProntuarioAba}
            onChange={handleChange}
            variant='fullWidth'
            scrollButtons='on'
            indicatorColor='primary'
            textColor='primary'
            aria-label='scrollable force tabs example'
          >
            <Tab
              label='Prontu??rio'
              icon={<AssignmentIndIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label='Prontu??rio de turma'
              icon={<AssignmentIndOutlinedIcon />}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={ProntuarioAba} index={0} spacing={0} m={0} p={0}>
          <ProntuarioCadastro></ProntuarioCadastro>
        </TabPanel>
        <TabPanel value={ProntuarioAba} index={1} spacing={0} m={0} p={0}>
          <ProntuarioCadastroTurma></ProntuarioCadastroTurma>
        </TabPanel>
      </Paper>
    </div>
  )
}
