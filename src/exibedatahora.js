import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import EventIcon from '@material-ui/icons/Event'
import TimerIcon from '@material-ui/icons/Timer'
const useStyles = makeStyles(theme => ({}))
export default function ExibeDataHora (props) {
  return (
    <Box
      flexWrap='wrap'
      display='flex'
      flexDirection='row'
      justifyContent='flex-start'
      p={0}
      m={0}
      bgcolor='white'
      style={{ height: '25px' }}
    >
      <Box direction='row' display='flex'>
        <EventIcon />
        <Typography
          variant='h7'
          display='block'
          gutterBottom
          style={{ color: '#306898', marginRight: '10px' }}
        >
          {props.data}
        </Typography>

        <br />
      </Box>
      <Box direction='row' display='flex' style={{ marginRight: '6px' }}>
        <TimerIcon />
        <Typography
          variant='h7'
          display='block'
          gutterBottom
          style={{ color: '#306898' }}
        >
          {props.hora}
        </Typography>
      </Box>
    </Box>
  )
}
