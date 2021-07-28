import { Store, createStore, combineReducers, applyMiddleware } from 'redux'

interface ConfigState {
  readonly IDAgendaSelProntuario: number
  readonly IDAlunoSelProntuario: number
  readonly NomeAlunoSelProntuario: string
  readonly IDProfessorSelProntuario: number
  readonly DataSelProntuario: Date
  readonly HoraSelProntuario: string
  readonly FotoAlunoSelProntuario: string
  readonly AgendaCancelada: boolean
  readonly AlunosSelecionadosParaTurma: string[]
}

export interface AppState {
  readonly configuracoes: ConfigState
}

const initialConfigState: ConfigState = {
  IDAgendaSelProntuario: 0,
  IDAlunoSelProntuario: 0,
  IDProfessorSelProntuario: 0,
  DataSelProntuario: new Date(),
  FotoAlunoSelProntuario: '',
  HoraSelProntuario: '',
  AgendaCancelada: false,
  NomeAlunoSelProntuario: '',
  AlunosSelecionadosParaTurma: []
}

export const GETTINCONFIG = 'GettingConfig'
export const gettingConfigAction = () =>
  ({
    type: GETTINCONFIG
  } as const)

export const SETIDAGENDASELPRONTUARIO = 'IDAgendaSelProntuario'
export const SetIDAgendaSelProntuarioAction = (idagenda: number) =>
  ({
    type: SETIDAGENDASELPRONTUARIO,
    idagenda: idagenda
  } as const)

export const SETIDALUNOSELPRONTUARIO = 'IDAlunoSelProntuario'
export const SetIDAlunoSelProntuarioAction = (idaluno: number) =>
  ({
    type: SETIDALUNOSELPRONTUARIO,
    idaluno: idaluno
  } as const)

export const SETNOMEALUNOSELPRONTUARIO = 'NomeAlunoSelProntuario'
export const SetNomeAlunoSelProntuarioAction = (nmaluno: string) =>
  ({
    type: SETNOMEALUNOSELPRONTUARIO,
    nmaluno: nmaluno
  } as const)

export const SETDATASELPRONTUARIO = 'DataSelProntuario'
export const SetDataSelProntuarioAction = (data: Date) =>
  ({
    type: SETDATASELPRONTUARIO,
    data: data
  } as const)

export const SETHORASELPRONTUARIO = 'HoraSelProntuario'
export const SetHoraSelProntuarioAction = (hora: string) =>
  ({
    type: SETHORASELPRONTUARIO,
    hora: hora
  } as const)

export const SETFOTOSELPRONTUARIO = 'FotoSelProntuario'
export const SetFotoSelProntuarioAction = (foto: string) =>
  ({
    type: SETFOTOSELPRONTUARIO,
    foto: foto
  } as const)

export const SETAGENDACANCELADA = 'AgendaCancelada'
export const SetAgendaCanceladaAction = (cancelada: boolean) =>
  ({
    type: SETAGENDACANCELADA,
    cancelada: cancelada
  } as const)

export const SETIDPROFESSORSELPRONTUARIO = 'IDProfessorSelProntuario'
export const SetIDProfessorSelProntuarioAction = (idprofessor: number) =>
  ({
    type: SETIDPROFESSORSELPRONTUARIO,
    idprofessor: idprofessor
  } as const)

export const SETALUNOSSELECIONADOSPARATURMA = 'AlunosSelecionadosParaTurma'
export const SetAlunosSelecionadosParaTurmaAction = (alunos: string[]) =>
  ({
    type: SETALUNOSSELECIONADOSPARATURMA,
    alunos: alunos
  } as const)

type ConfigActions =
  | ReturnType<typeof gettingConfigAction>
  | ReturnType<typeof SetIDAgendaSelProntuarioAction>
  | ReturnType<typeof SetIDAlunoSelProntuarioAction>
  | ReturnType<typeof SetDataSelProntuarioAction>
  | ReturnType<typeof SetHoraSelProntuarioAction>
  | ReturnType<typeof SetFotoSelProntuarioAction>
  | ReturnType<typeof SetAgendaCanceladaAction>
  | ReturnType<typeof SetIDProfessorSelProntuarioAction>
  | ReturnType<typeof SetNomeAlunoSelProntuarioAction>
  | ReturnType<typeof SetAlunosSelecionadosParaTurmaAction>

const configReducer = (state = initialConfigState, action: ConfigActions) => {
  switch (action.type) {
    case GETTINCONFIG: {
      return {
        ...state
      }
    }
    case SETIDAGENDASELPRONTUARIO: {
      return {
        ...state,
        IDAgendaSelProntuario: action.idagenda
      }
    }
    case SETIDALUNOSELPRONTUARIO: {
      return {
        ...state,
        IDAlunoSelProntuario: action.idaluno
      }
    }
    case SETNOMEALUNOSELPRONTUARIO: {
      return {
        ...state,
        NomeAlunoSelProntuario: action.nmaluno
      }
    }
    case SETIDPROFESSORSELPRONTUARIO: {
      return {
        ...state,
        IDProfessorSelProntuario: action.idprofessor
      }
    }

    case SETDATASELPRONTUARIO: {
      return {
        ...state,
        DataSelProntuario: action.data
      }
    }
    case SETHORASELPRONTUARIO: {
      return {
        ...state,
        HoraSelProntuario: action.hora
      }
    }

    case SETFOTOSELPRONTUARIO: {
      return {
        ...state,
        FotoAlunoSelProntuario: action.foto
      }
    }
    case SETAGENDACANCELADA: {
      return {
        ...state,
        AgendaCancelada: action.cancelada
      }
    }
    case SETALUNOSSELECIONADOSPARATURMA: {
      return {
        ...state,
        Alunos: action.alunos
      }
    }

  }

  return state
}

const rootReducer = combineReducers<AppState>({
  configuracoes: configReducer
})

export const store = createStore(rootReducer)

export const action = (type: any) => store.dispatch({ type })
