import { Store, createStore, combineReducers, applyMiddleware } from "redux";

interface ConfigState {
  readonly IDAgendaSelProntuario: number;
  readonly IDAlunoSelProntuario: number;
  readonly NomeAlunoSelProntuario: string;
  readonly IDProfessorSelProntuario: number;
  readonly DataSelProntuario: Date;
  readonly HoraSelProntuario: string;

  readonly IDAgendaSelProntuarioTurma: number;
  readonly IDTurmaSelProntuario: number;
  readonly NomeTurmaSelProntuario: string;
  readonly IDProfessorSelProntuarioTurma: number;
  readonly DataSelProntuarioTurma: Date;
  readonly HoraSelProntuarioTurma: string;

  readonly FotoAlunoSelProntuario: string;
  readonly AgendaCancelada: boolean;
  readonly AlunosSelecionadosParaTurma: string;
  readonly AlunosRemovidosdaTurma: string;
  readonly SelecionandoAlunosParaTurma: boolean;
  readonly RemovendoAlunosParaTurma: boolean;
  readonly TurmaSelecionada: number;
}

export interface AppState {
  readonly configuracoes: ConfigState;
}

const initialConfigState: ConfigState = {
  IDAgendaSelProntuario: 0,
  IDAlunoSelProntuario: 0,
  IDProfessorSelProntuario: 0,
  DataSelProntuario: new Date(),

  IDAgendaSelProntuarioTurma: 0,
  IDTurmaSelProntuario: 0,
  IDProfessorSelProntuarioTurma: 0,
  DataSelProntuarioTurma: new Date(),

  FotoAlunoSelProntuario: "",
  HoraSelProntuario: "",
  HoraSelProntuarioTurma: "",
  AgendaCancelada: false,
  NomeAlunoSelProntuario: "",
  NomeTurmaSelProntuario: "",
  AlunosSelecionadosParaTurma: "",
  SelecionandoAlunosParaTurma: false,
  TurmaSelecionada: 0,
  AlunosRemovidosdaTurma: "",
  RemovendoAlunosParaTurma: false,
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

export const SETIDAGENDASELPRONTUARIOTURMA = "IDAgendaSelProntuarioTurma";
export const SetIDAgendaSelProntuarioTurmaAction = (idagenda: number) =>
  ({
    type: SETIDAGENDASELPRONTUARIOTURMA,
    idagenda: idagenda,
  } as const);

export const SETIDALUNOSELPRONTUARIO = "IDAlunoSelProntuario";
export const SetIDAlunoSelProntuarioAction = (idaluno: number) =>
  ({
    type: SETIDALUNOSELPRONTUARIO,
    idaluno: idaluno,
  } as const);

export const SETIDTURMASELPRONTUARIO = "IDTurmaSelProntuario";
export const SetIDTurmaSelProntuarioAction = (idturma: number) =>
  ({
    type: SETIDTURMASELPRONTUARIO,
    idturma: idturma,
  } as const);

export const SETNOMEALUNOSELPRONTUARIO = "NomeAlunoSelProntuario";
export const SetNomeAlunoSelProntuarioAction = (nmaluno: string) =>
  ({
    type: SETNOMEALUNOSELPRONTUARIO,
    nmaluno: nmaluno,
  } as const);

export const SETNOMETURMASELPRONTUARIO = "NomeTurmaSelProntuario";
export const SetNomeTurmaSelProntuarioAction = (nmturma: string) =>
  ({
    type: SETNOMETURMASELPRONTUARIO,
    nmturma: nmturma,
  } as const);

export const SETDATASELPRONTUARIO = "DataSelProntuario";
export const SetDataSelProntuarioAction = (data: Date) =>
  ({
    type: SETDATASELPRONTUARIO,
    data: data,
  } as const);

export const SETDATASELPRONTUARIOTURMA = "DataSelProntuarioTurma";
export const SetDataSelProntuarioTurmaAction = (data: Date) =>
  ({
    type: SETDATASELPRONTUARIOTURMA,
    data: data,
  } as const);

export const SETHORASELPRONTUARIO = "HoraSelProntuario";
export const SetHoraSelProntuarioAction = (hora: string) =>
  ({
    type: SETHORASELPRONTUARIO,
    hora: hora,
  } as const);

export const SETHORASELPRONTUARIOTURMA = "HoraSelProntuarioTurma";
export const SetHoraSelProntuarioTurmaAction = (hora: string) =>
  ({
    type: SETHORASELPRONTUARIOTURMA,
    hora: hora,
  } as const);

export const SETFOTOSELPRONTUARIO = "FotoSelProntuario";
export const SetFotoSelProntuarioAction = (foto: string) =>
  ({
    type: SETFOTOSELPRONTUARIO,
    foto: foto,
  } as const);

export const SETAGENDACANCELADA = "AgendaCancelada";
export const SetAgendaCanceladaAction = (cancelada: boolean) =>
  ({
    type: SETAGENDACANCELADA,
    cancelada: cancelada,
  } as const);

export const SETIDPROFESSORSELPRONTUARIO = "IDProfessorSelProntuario";
export const SetIDProfessorSelProntuarioAction = (idprofessor: number) =>
  ({
    type: SETIDPROFESSORSELPRONTUARIO,
    idprofessor: idprofessor,
  } as const);

export const SETALUNOSSELECIONADOSPARATURMA = "AlunosSelecionadosParaTurma";
export const SetAlunosSelecionadosParaTurmaAction = (alunos: string) =>
  ({
    type: SETALUNOSSELECIONADOSPARATURMA,
    alunos: alunos,
  } as const);

export const SETSELECIONANDOALUNOSPARATURMA = "SelecionandoAlunosParaTurma";
export const SetSelecionandoAlunosParaTurmaAction = (selecionando: boolean) =>
  ({
    type: SETSELECIONANDOALUNOSPARATURMA,
    selecionando: selecionando,
  } as const);

export const SETTURMASELECIONADA = "TurmaSelecionada";
export const SetTurmaSelecionadaAction = (idturma: number) =>
  ({
    type: SETTURMASELECIONADA,
    idturma: idturma,
  } as const);

export const SETALUNOSREMOVIDOSDATURMA = "AlunosRemovidosdaTurma";
export const SetAlunosRemovidosdaTurmaAction = (alunos: string) =>
  ({
    type: SETALUNOSREMOVIDOSDATURMA,
    alunos: alunos,
  } as const);

export const SETREMOVENDOALUNOSDATURMA = "RemovendoAlunosdaTurma";
export const SetAlunosRemovendodaTurmaAction = (removendo: boolean) =>
  ({
    type: SETREMOVENDOALUNOSDATURMA,
    removendo: removendo,
  } as const);

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
  | ReturnType<typeof SetSelecionandoAlunosParaTurmaAction>
  | ReturnType<typeof SetTurmaSelecionadaAction>
  | ReturnType<typeof SetAlunosRemovidosdaTurmaAction>
  | ReturnType<typeof SetAlunosRemovendodaTurmaAction>
  | ReturnType<typeof SetIDAgendaSelProntuarioTurmaAction>
  | ReturnType<typeof SetIDTurmaSelProntuarioAction>
  | ReturnType<typeof SetAlunosSelecionadosParaTurmaAction>
  | ReturnType<typeof SetDataSelProntuarioTurmaAction>
  | ReturnType<typeof SetHoraSelProntuarioTurmaAction>
  | ReturnType<typeof SetNomeTurmaSelProntuarioAction>;

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
    case SETNOMEALUNOSELPRONTUARIO: {
      return {
        ...state,
        NomeAlunoSelProntuario: action.nmaluno,
      };
    }
    case SETIDPROFESSORSELPRONTUARIO: {
      return {
        ...state,
        IDProfessorSelProntuario: action.idprofessor,
      };
    }

    case SETDATASELPRONTUARIO: {
      return {
        ...state,
        DataSelProntuario: action.data,
      };
    }
    case SETHORASELPRONTUARIO: {
      return {
        ...state,
        HoraSelProntuario: action.hora,
      };
    }

    case SETFOTOSELPRONTUARIO: {
      return {
        ...state,
        FotoAlunoSelProntuario: action.foto,
      };
    }
    case SETAGENDACANCELADA: {
      return {
        ...state,
        AgendaCancelada: action.cancelada,
      };
    }
    case SETALUNOSSELECIONADOSPARATURMA: {
      return {
        ...state,
        AlunosSelecionadosParaTurma: action.alunos,
      };
    }
    case SETSELECIONANDOALUNOSPARATURMA: {
      return {
        ...state,
        SelecionandoAlunosParaTurma: action.selecionando,
      };
    }
    case SETTURMASELECIONADA: {
      return {
        ...state,
        TurmaSelecionada: action.idturma,
      };
    }
    case SETALUNOSREMOVIDOSDATURMA: {
      return {
        ...state,
        AlunosRemovidosdaTurma: action.alunos,
      };
    }
    case SETREMOVENDOALUNOSDATURMA: {
      return {
        ...state,
        RemovendoAlunosParaTurma: action.removendo,
      };
    }
    case SETIDAGENDASELPRONTUARIOTURMA: {
      return {
        ...state,
        IDAgendaSelProntuarioTurma: action.idagenda,
      };
    }
    case SETIDTURMASELPRONTUARIO: {
      return {
        ...state,
        IDTurmaSelProntuario: action.idturma,
      };
    }
    case SETNOMETURMASELPRONTUARIO: {
      return {
        ...state,
        NomeTurmaSelProntuario: action.nmturma,
      };
    }
    case SETDATASELPRONTUARIOTURMA: {
      return {
        ...state,
        DataSelProntuarioTurma: action.data,
      };
    }
    case SETHORASELPRONTUARIOTURMA: {
      return {
        ...state,
        HoraSelProntuarioTurma: action.hora,
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
