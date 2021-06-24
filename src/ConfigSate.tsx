import { Store, createStore, combineReducers, applyMiddleware } from "redux";

interface ConfigState {
  readonly IDAgendaSelProntuario: number;
  readonly IDAlunoSelProntuario: number;
}

export interface AppState {
  readonly configuracoes: ConfigState;
}

const initialConfigState: ConfigState = {
  IDAgendaSelProntuario: 0,
  IDAlunoSelProntuario: 0,
};

export const GETTINCONFIG = "GettingConfig";
export const gettingConfigAction = () =>
  ({
    type: GETTINCONFIG,
  } as const);

export const SETIDAGENDASELPRONTUARIO = "IDAgendaSelProntuario";
export const SetIDAgendaSelProntuarioAction = (idagenda: number) =>
  ({
    type: SETIDAGENDASELPRONTUARIO,
    idagenda: idagenda,
  } as const);

export const SETIDALUNOSELPRONTUARIO = "IDAlunoSelProntuario";
export const SetIDAlunoSelProntuarioAction = (idaluno: number) =>
  ({
    type: SETIDALUNOSELPRONTUARIO,
    idaluno: idaluno,
  } as const);

type ConfigActions =
  | ReturnType<typeof gettingConfigAction>
  | ReturnType<typeof SetIDAgendaSelProntuarioAction>
  | ReturnType<typeof SetIDAlunoSelProntuarioAction>;

const configReducer = (state = initialConfigState, action: ConfigActions) => {
  switch (action.type) {
    case GETTINCONFIG: {
      return {
        ...state,
      };
    }
    case SETIDAGENDASELPRONTUARIO: {
      return {
        ...state,
        IDAgendaSelProntuario: action.idagenda,
      };
    }
    case SETIDALUNOSELPRONTUARIO: {
      return {
        ...state,
        IDAlunoSelProntuario: action.idaluno,
      };
    }
  }

  return state;
};

const rootReducer = combineReducers<AppState>({
  configuracoes: configReducer,
});

export const store = createStore(rootReducer);

export const action = (type: any) => store.dispatch({ type });
