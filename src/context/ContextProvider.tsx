import React, { useReducer, useContext } from 'react';
import { PENGUIN_DIETS, PENGUIN_YEARS } from '@/types/penguin';
import { AppAction, AppActionType } from './actions';

export interface AppState {
  appTitle: string;
  apiModalOpen: boolean;
  helpModalOpen: boolean;
  selectedSpecies: string[];
  selectedIsland: string;
  selectedSex: string;
  selectedDiet: string[];
  selectedLifeStage: string;
  selectedYearRange: [number, number];
}

/**
 * AppProviderProps props are the same as the State except
 * some of the required props in the State are optional props.
 * These props have default values set in the initialState object.
 */
interface AppProviderProps extends Partial<AppState> {
  apiModalOpen?: boolean;
  helpModalOpen?: boolean;
  selectedSpecies?: string[];
  selectedIsland?: string;
  selectedSex?: string;
  selectedDiet?: string[];
  selectedLifeStage?: string;
  selectedYearRange?: [number, number];
  children: React.ReactNode;
}

const AppContext = React.createContext<
  { state: AppState; dispatch: React.Dispatch<AppAction> } | undefined
>(undefined);

const initialState: AppState = {
  appTitle: '',
  apiModalOpen: false,
  helpModalOpen: false,
  selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'], // All selected by default
  selectedIsland: 'all', // All islands by default
  selectedSex: 'all', // All sexes by default
  selectedDiet: [...PENGUIN_DIETS],
  selectedLifeStage: 'all',
  selectedYearRange: [
    PENGUIN_YEARS[0],
    PENGUIN_YEARS[PENGUIN_YEARS.length - 1],
  ],
};

const initState = (state: AppState, props: AppProviderProps) => {
  const { children, ...rest } = props;
  return {
    ...state,
    ...rest,
  };
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionType.OPEN_API_MODAL: {
      return {
        ...state,
        apiModalOpen: true,
      };
    }
    case AppActionType.CLOSE_API_MODAL: {
      return {
        ...state,
        apiModalOpen: false,
      };
    }
    case AppActionType.OPEN_HELP_MODAL: {
      return {
        ...state,
        helpModalOpen: true,
      };
    }
    case AppActionType.CLOSE_HELP_MODAL: {
      return {
        ...state,
        helpModalOpen: false,
      };
    }
    case AppActionType.CLOSE_ALL_MODALS: {
      return {
        ...state,
        apiModalOpen: false,
        helpModalOpen: false,
      };
    }
    case 'UPDATE_SPECIES_FILTER' as any: {
      return {
        ...state,
        selectedSpecies: action.payload,
      };
    }
    case 'UPDATE_ISLAND_FILTER' as any: {
      return {
        ...state,
        selectedIsland: action.payload,
      };
    }
    case 'UPDATE_SEX_FILTER' as any: {
      return {
        ...state,
        selectedSex: action.payload,
      };
    }
    case 'UPDATE_DIET_FILTER' as any: {
      return {
        ...state,
        selectedDiet: action.payload,
      };
    }
    case 'UPDATE_LIFE_STAGE_FILTER' as any: {
      return {
        ...state,
        selectedLifeStage: action.payload,
      };
    }
    case 'UPDATE_YEAR_RANGE_FILTER' as any: {
      return {
        ...state,
        selectedYearRange: action.payload,
      };
    }
    case AppActionType.CLEAR_ALL_FILTERS: {
      return {
        ...state,
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'all',
        selectedDiet: [...PENGUIN_DIETS],
        selectedLifeStage: 'all',
        selectedYearRange: [
          PENGUIN_YEARS[0],
          PENGUIN_YEARS[PENGUIN_YEARS.length - 1],
        ],
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const [state, dispatch] = useReducer(
    appReducer,
    initState(initialState, props)
  );
  const value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
