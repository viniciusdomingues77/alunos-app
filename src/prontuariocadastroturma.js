import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AgendasTurma from './gradedatahorarioturma'
import Grid from '@material-ui/core/Grid'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { useSelector, useDispatch } from 'react-redux'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { Alert } from '@material-ui/lab'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation'
import Snackbar from '@material-ui/core/Snackbar'
import ExibeDataHora from './exibedatahora'
import { server } from './server'
import {
  action,
  AppState,
  store,
  SetIDAgendaSelProntuarioTurmaAction,
  SetIDTurmaSelProntuarioAction,
  SetIDProfessorSelProntuarioTurmaAction,
  SetNomeAlunoSelProntuarioAction,
  SetHoraSelProntuarioAction,
  SetTurmaSelecionadaAction,
  SetHoraSelProntuarioTurmaAction,
  SetNomeTurmaSelProntuarioAction,
  SetDataSelProntuarioTurmaAction
} from './ConfigSate'
import ReactDOM from 'react-dom'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import SaveIcon from '@material-ui/icons/Save'
import BarraProgressoFixa from './barraprogressofixa'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 30,
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  texteditor: {
    backgroundColor: '#306898',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: 'white',
    marginBottom: '5px',
    textAlign: 'center'
  },
  wrapperclass: {
    padding: '1rem',
    border: '1px solid #ccc'
  },
  editorclass: {
    backgroundColor: '#ECF0F1',
    padding: '1rem',
    border: '1px solid #306898s',
    height: '300px',
    minHeight: '300px'
  },
  toolbarclass: {
    border: '1px solid #ccc'
  },
  cabecalho: {
    with: '100%',
    height: '10px'
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  divEditor: {}
}))

export default function ProntuarioCadastroTurma () {
  const [professores, setProfessores] = React.useState([])
  const [Professor, setProfessor] = React.useState('')
  const classes = useStyles()
  const [Turmas, setTurmas] = React.useState([])
  const [Turma, setTurma] = React.useState('')
  const { promiseInProgress } = usePromiseTracker()
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState('')
  const [dataExt, setdataExt] = React.useState('')
  const [openError, setOpenError] = React.useState(false)

  const [openSuccess, setOpenSuccess] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  })

  const { vertical, horizontal, open } = openSuccess
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  )

  const idturmasel = useSelector(
    state => state.configuracoes.IDTurmaSelProntuario
  )

  const idagendasel = useSelector(
    state => state.configuracoes.IDAgendaSelProntuarioTurma
  )

  const datasel = useSelector(
    state => state.configuracoes.DataSelProntuarioTurma
  )
  const horasel = useSelector(
    state => state.configuracoes.HoraSelProntuarioTurma
  )

  function MesporExtenso (nummes) {
    switch (nummes) {
      case 0:
        return 'Janeiro'
        break
      case 1:
        return 'Fevereiro'
        break
      case 2:
        return 'Março'
        break
      case 3:
        return 'Abril'
        break
      case 4:
        return 'Maio'
        break
      case 5:
        return 'Junho'
        break
      case 6:
        return 'Julho'
        break
      case 7:
        return 'Agosto'
        break
      case 8:
        return 'Setembro'
        break
      case 9:
        return 'Outubro'
        break
      case 10:
        return 'Novembro'
        break
      case 11:
        return 'Dezembro'
        break

      default:
    }
  }

  function DiaporExtenso (numdia) {
    switch (numdia) {
      case 0:
        return 'Domingo'
        break
      case 1:
        return 'Segunda'
        break
      case 2:
        return 'Terça'
        break
      case 3:
        return 'Quarta'
        break
      case 4:
        return 'Quinta'
        break
      case 5:
        return 'Sexta'
        break
      case 6:
        return 'Sábado'
        break

      default:
    }
  }

  function DataporExtenso (data) {
    var dt =
      data.getDate() +
      ' de ' +
      MesporExtenso(data.getMonth()) +
      ' de ' +
      data.getFullYear() +
      ' ' +
      DiaporExtenso(data.getDay())
    return dt
  }

  const dispatch = useDispatch()
  const SelTurma = (idturma, turma) => {
    setTextoBarraProgresso('Carregando agendas da turma')
    dispatch(SetIDTurmaSelProntuarioAction(idturma))
    dispatch(SetTurmaSelecionadaAction(turma))
    dispatch(SetHoraSelProntuarioTurmaAction(''))
  }

  const SelIdProfessor = idprofessor => {
    setTextoBarraProgresso('Carregando agendas da turma')
    dispatch(SetIDProfessorSelProntuarioTurmaAction(idprofessor))
  }

  const SalvarProntuario = () => {
    var texto = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idagenda_turma: idagendasel,
        texto: texto
      })
    }

    setTextoBarraProgresso('Salvando prontuário')
    trackPromise(
      fetch(server + '/api/prontuario/salvarpronturarioturma', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(response => response.json())
        .then(d =>
          setOpenSuccess({ open: true, vertical: 'top', horizontal: 'center' })
        )
        .catch(function (error) {
          console.log('catch error' + error)
          //setSubmitSuccess(false);
          setOpenError(true)
        })
    )
  }

  React.useEffect(() => {
    if (idagendasel == 0) {
      setdataExt('')
    }
  })

  React.useEffect(() => {
    setdataExt('')
    setTextoBarraProgresso('Listando Turmas')

    const apiUrl = server + `/api/turma/`
    trackPromise(
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setTurmas(data)
        })
        .catch(function (error) {
          console.log('catch error' + error)
          setOpenError(true)
        })
    )

    const apiUrlp = server + `/api/professor`
    trackPromise(
      fetch(apiUrlp)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setProfessores(data)
        })
        .catch(function (error) {
          console.log('catch error' + error)
          setOpenError(true)
        })
    )

    return () => {
      dispatch(SetIDAgendaSelProntuarioTurmaAction(0))
      dispatch(SetIDTurmaSelProntuarioAction(0))
      dispatch(SetNomeTurmaSelProntuarioAction(''))
      dispatch(SetDataSelProntuarioTurmaAction(''))
      dispatch(SetHoraSelProntuarioTurmaAction(''))
    }
  }, [])

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenError(false)
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSuccess({ open: false, vertical: 'top', horizontal: 'center' })
  }

  React.useEffect(() => {
    setTextoBarraProgresso('Carregando prontuário')
    if (idagendasel == 0) {
      setEditorState(EditorState.createEmpty())
      return
    }
    const apiUrl2 =
      server + `/api/prontuario/pronturarioturma?idagenda_turma=` + idagendasel
    trackPromise(
      fetch(apiUrl2)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }

          return response
        })
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.texto) {
              setEditorState(
                EditorState.createWithContent(
                  convertFromRaw(JSON.parse(data.texto))
                )
              )
            } else {
              setEditorState(EditorState.createEmpty())
            }
          } else {
            setEditorState(EditorState.createEmpty())
          }
          if (idagendasel) {
            if (idagendasel > 0) {
              setdataExt(DataporExtenso(datasel))
            }
          }
        })
        .catch(function (error) {
          console.log('catch error' + error)
          setEditorState(EditorState.createEmpty())
          setOpenError(true)
        })
    )
  }, [idagendasel])
  function ClearFields () {}
  return (
    <React.Fragment>
      <div className={classes.cabecalho}>
        <BarraProgressoFixa
          titulo={TextoBarraProgresso}
          loading={promiseInProgress}
        />
      </div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <Grid container spacing={3} direction='column'>
              <Grid item xs={12}>
                <Autocomplete
                  value={Turma}
                  id='autocomplete'
                  disabled={promiseInProgress}
                  onChange={(event, newValue) => {
                    setTurma(newValue)
                    console.log('Turma on change ' + newValue)
                    var idturma = '0'
                    var turma = ''
                    if (newValue) {
                      idturma = newValue
                        .substring(0, newValue.indexOf('-'))
                        .trim()
                      turma = newValue
                        .substring(newValue.indexOf('-') + 1, newValue.lenght)
                        .trim()
                    }
                    SelTurma(idturma, turma)
                    dispatch(SetIDAgendaSelProntuarioTurmaAction(0))
                  }}
                  options={Turmas.map(
                    turma => `${turma.idturma} - ${turma.turma}`
                  )}
                  getOptionSelected={(option, value) => {
                    return option === value
                  }}
                  style={{ width: '100%', marginBottom: 2 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Turmas'
                      required
                      autoFocus
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={Professor}
                  disabled={promiseInProgress}
                  id='autocomplete'
                  onChange={(event, newValue) => {
                    setProfessor(newValue)
                    var idprofessor = '0'
                    if (newValue) {
                      idprofessor = newValue
                        .substring(0, newValue.indexOf('-'))
                        .trim()
                    }
                    SelIdProfessor(idprofessor)
                  }}
                  options={professores.map(
                    professor => `${professor.idprofessor} - ${professor.nome}`
                  )}
                  getOptionSelected={(option, value) => {
                    return option === value
                  }}
                  style={{ width: '100%', marginBottom: 5 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Professor'
                      required
                      autoFocus
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <AgendasTurma
              disabled={promiseInProgress}
              setOpenError={setOpenError}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <ExibeDataHora data={dataExt} hora={horasel} />
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 8 }}>
          <Grid item xs={12}>
            <div className='divEditor'>
              <header className={classes.texteditor}>Prontuário</header>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName={classes.wrapperclass}
                editorClassName={classes.editorclass}
                toolbarClassName={classes.toolbarclass}
                readOnly={
                  idturmasel == 0 || idagendasel == 0 || promiseInProgress
                }
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: '30px' }}>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='#e8eaf6'
              size='large'
              startIcon={<SaveIcon />}
              onClick={SalvarProntuario}
              disabled={
                idturmasel == 0 || idagendasel == 0 || promiseInProgress
              }
            >
              Salvar
            </Button>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </div>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity='error'>
          Não foi possível realizar a operação. Contacte o desenvolvedor
        </Alert>
      </Snackbar>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity='success'>
          Operação realizada com sucesso!
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}
