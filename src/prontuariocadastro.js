import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AgendasAluno from './gradedatahorario'
import Grid from '@material-ui/core/Grid'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { useSelector, useDispatch } from 'react-redux'
import { usePromiseTracker, trackPromise } from 'react-promise-tracker'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation'
import {
  action,
  AppState,
  store,
  SetIDAlunoSelProntuarioAction
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
    height: '300px'
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

export default function ProntuarioCadastro () {
  const [professores, setProfessores] = React.useState([])
  const [Professor, setProfessor] = React.useState('')
  const classes = useStyles()
  const [Alunos, setAlunos] = React.useState([])
  const [Aluno, setAluno] = React.useState('')
  const { promiseInProgress } = usePromiseTracker()
  const [TextoBarraProgresso, setTextoBarraProgresso] = React.useState('')
  const [dataExt, setdataExt] = React.useState('')
  const [openError, setOpenError] = React.useState(false)
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  )
  const idalunosel = useSelector(
    state => state.configuracoes.IDAlunoSelProntuario
  )

  const idagendasel = useSelector(
    state => state.configuracoes.IDAgendaSelProntuario
  )

  const fotoalunosel = useSelector(
    state => state.configuracoes.FotoAlunoSelProntuario
  )

  const datasel = useSelector(state => state.configuracoes.DataSelProntuario)

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

  function DataporExtenso (data) {
    var dt =
      data.getDate() +
      ' de ' +
      MesporExtenso(data.getMonth()) +
      ' de ' +
      data.getFullYear()
    return dt
  }
  const dispatch = useDispatch()
  const SelIdAluno = idaluno => {
    setTextoBarraProgresso('Carregando agendas do aluno')
    dispatch(SetIDAlunoSelProntuarioAction(idaluno))
  }
  const SalvarProntuario = () => {
    var texto = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idagenda: idagendasel,
        texto: texto
      })
    }
    setTextoBarraProgresso('Salvando prontuário')
    trackPromise(
      fetch('https://localhost:44363/api/prontuario/', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        })
        .then(response => response.json())
        .then(d => console.log('data res ' + d))
        .catch(function (error) {
          console.log('catch error' + error)
          //setSubmitSuccess(false);
          //setOpenError(true);
        })
    )
  }

  React.useEffect(() => {
    setTextoBarraProgresso('Listando alunos')
    const apiUrl = `https://localhost:44363/api/aluno/identificacao`
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
          setAlunos(data)
        })
        .catch(function (error) {
          console.log('catch error' + error)
          //setOpenError(true);
        })
    )
    const apiUrlp = `https://localhost:44363/api/professor`
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
  }, [])

  React.useEffect(() => {
    if (idagendasel == 0) {
      return
    }

    setTextoBarraProgresso('Carregando prontuário')
    const apiUrl2 =
      `https://localhost:44363/api/prontuario?idagenda=` + idagendasel
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
          setdataExt(DataporExtenso(datasel))
        })
        .catch(function (error) {
          console.log('catch error' + error)
          setEditorState(EditorState.createEmpty())
          //setOpenError(true);
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
                  value={Professor}
                  id='autocomplete'
                  onChange={(event, newValue) => {
                    setProfessor(newValue)
                    if (newValue) {
                    }
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
              <Grid item xs={12}>
                <Autocomplete
                  value={Aluno}
                  id='autocomplete'
                  onChange={(event, newValue) => {
                    setAluno(newValue)
                    console.log('aluno on change ' + newValue)
                    var idaluno = '0'
                    if (newValue) {
                      idaluno = newValue
                        .substring(0, newValue.indexOf('-'))
                        .trim()
                    }
                    SelIdAluno(idaluno)
                  }}
                  options={Alunos.map(
                    aluno => `${aluno.idaluno} - ${aluno.nome}`
                  )}
                  getOptionSelected={(option, value) => {
                    return option === value
                  }}
                  style={{ width: '100%', marginBottom: 2 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Aluno'
                      required
                      autoFocus
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Avatar className={classes.avatar} src={fotoalunosel}></Avatar> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <AgendasAluno />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <Typography variant='h5' display='block' gutterBottom>
            {dataExt}
          </Typography>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <div className='divEditor'>
              <header className={classes.texteditor}>Prontuário</header>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName={classes.wrapperclass}
                editorClassName={classes.editorclass}
                toolbarClassName={classes.toolbarclass}
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
            >
              Salvar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='#e8eaf6'
              size='large'
              startIcon={<CancelPresentationIcon />}
              onClick={ClearFields}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  )
}
