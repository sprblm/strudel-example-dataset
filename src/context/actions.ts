export enum AppActionType {
  OPEN_API_MODAL = 'OPEN_API_MODAL',
  CLOSE_API_MODAL = 'CLOSE_API_MODAL',
  OPEN_HELP_MODAL = 'OPEN_HELP_MODAL',
  CLOSE_HELP_MODAL = 'CLOSE_HELP_MODAL',
  CLOSE_ALL_MODALS = 'CLOSE_ALL_MODALS',
  UPDATE_SPECIES_FILTER = 'UPDATE_SPECIES_FILTER',
  UPDATE_ISLAND_FILTER = 'UPDATE_ISLAND_FILTER',
  UPDATE_SEX_FILTER = 'UPDATE_SEX_FILTER',
  CLEAR_ALL_FILTERS = 'CLEAR_ALL_FILTERS',
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}

export const openApiModal = (): AppAction => ({
  type: AppActionType.OPEN_API_MODAL,
});

export const closeApiModal = (): AppAction => ({
  type: AppActionType.CLOSE_API_MODAL,
});

export const updateSpeciesFilter = (species: string[]): AppAction => ({
  type: AppActionType.UPDATE_SPECIES_FILTER,
  payload: species,
});

export const updateIslandFilter = (island: string): AppAction => ({
  type: AppActionType.UPDATE_ISLAND_FILTER,
  payload: island,
});

export const updateSexFilter = (sex: string): AppAction => ({
  type: AppActionType.UPDATE_SEX_FILTER,
  payload: sex,
});

export const clearAllFilters = (): AppAction => ({
  type: AppActionType.CLEAR_ALL_FILTERS,
  payload: null,
});

export const openHelpModal = (): AppAction => ({
  type: AppActionType.OPEN_HELP_MODAL,
});

export const closeHelpModal = (): AppAction => ({
  type: AppActionType.CLOSE_HELP_MODAL,
});

export const closeAllModals = (): AppAction => ({
  type: AppActionType.CLOSE_ALL_MODALS,
});
