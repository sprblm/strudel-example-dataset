export enum AppActionType {
  OPEN_API_MODAL = 'OPEN_API_MODAL',
  CLOSE_API_MODAL = 'CLOSE_API_MODAL',
  UPDATE_SPECIES_FILTER = 'UPDATE_SPECIES_FILTER',
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
