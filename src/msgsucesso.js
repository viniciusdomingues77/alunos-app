import React from 'react'
import Box from '@material-ui/core/Box'
import CheckIcon from '@material-ui/icons/Check'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  msg: {
    color: '#009688'
  },
  ico: {
    color: 'action'
  }
}))

export default function MsgSucesso () {
  const classes = useStyles()

  return (
    <div style={{ width: '100%' }}>
      <Box
        display='flex'
        flexDirection='row'
        p={1}
        m={1}
        bgcolor='background.paper'
      >
        <Box p={0}>
          <CheckIcon className={classes.ico} />
        </Box>
        <Box p={0}>
          <Typography
            variant='overline'
            component='subtitle'
            className={classes.msg}
          >
            Operação realizada com sucesso
          </Typography>
        </Box>
      </Box>
    </div>
  )
}
