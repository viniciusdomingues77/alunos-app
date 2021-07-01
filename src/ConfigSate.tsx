import { Store, createStore, combineReducers, applyMiddleware } from 'redux'

interface ConfigState {
  readonly IDAgendaSelProntuario: number
  readonly IDAlunoSelProntuario: number
  readonly IDProfessorSelProntuario: number
  readonly DataSelProntuario: Date
  readonly FotoAlunoSelProntuario: string
  readonly AgendaCancelada: boolean
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
  AgendaCancelada: false
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

export const SETDATASELPRONTUARIO = 'DataSelProntuario'
export const SetDataSelProntuarioAction = (data: Date) =>
  ({
    type: SETDATASELPRONTUARIO,
    data: data
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

type ConfigActions =
  | ReturnType<typeof gettingConfigAction>
  | ReturnType<typeof SetIDAgendaSelProntuarioAction>
  | ReturnType<typeof SetIDAlunoSelProntuarioAction>
  | ReturnType<typeof SetDataSelProntuarioAction>
  | ReturnType<typeof SetFotoSelProntuarioAction>
  | ReturnType<typeof SetAgendaCanceladaAction>
  | ReturnType<typeof SetIDProfessorSelProntuarioAction>

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
  }

  return state
}

const rootReducer = combineReducers<AppState>({
  configuracoes: configReducer
})

export const store = createStore(rootReducer)

export const action = (type: any) => store.dispatch({ type })
