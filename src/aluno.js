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
import AlunoCadastro from './alunocadastro'
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginLeft: theme.spacing(18),
      marginTop: theme.spacing(3),
      width: theme.spacing(120),
      height: theme.spacing(70)
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
export default function Aluno () {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
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
            value={value}
            onChange={handleChange}
            variant='fullWidth'
            scrollButtons='on'
            indicatorColor='primary'
            textColor='primary'
            aria-label='scrollable force tabs example'
          >
            <Tab
              label='Cadastro de aluno'
              icon={<AssignmentIndIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label='Alunos cadastrados'
              icon={<ListIcon />}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <AlunoCadastro />
        </TabPanel>
        <TabPanel value={value} index={1}></TabPanel>
        {/* <CabecalhoModulo titulo="Aluno" /> */}
        {/* <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon tabs example"
        >
          <Tab icon={<AssignmentIndIcon />} label="Cadastro de aluno">
            
          </Tab>
          <Tab icon={<ListIcon />} label="Lista de alunos cadastrados">
            
          </Tab>
        </Tabs> */}
        {/* <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel> */}

        {/* <AlunosLista /> */}
      </Paper>
    </div>
  )
}
