import { GameQuitToMainMenuAction, GAME_QUIT_TO_MAIN_MENU } from "./game";
import { Reducer } from "redux";
import { Country, ForEveryCountry } from "../types/country";
import { mapObjIndexed } from "ramda";
import countryData, { CountryData } from "../services/data/countries";

export interface CountryState {
  countries: ForEveryCountry<Country>;
}

const defaultState: CountryState = {
  countries: mapObjIndexed<CountryData, Country>((countryData) => {
    return { ...countryData, strength: countryData.strength() };
  }, countryData) as ForEveryCountry<Country>
};

const COUNTRY_ALTER_STRENGTH = "COUNTRY_ALTER_STRENGTH";
const COUNTRY_SET_STRENGTH = "COUNTRY_SET_STRENGTH";

interface CountryAlterStrengthAction {
  type: typeof COUNTRY_ALTER_STRENGTH;
  payload: {
    country: string;
    amount: number;
  };
}

interface CountrySetStrengthAction {
  type: typeof COUNTRY_SET_STRENGTH;
  payload: {
    country: string;
    strength: number;
  };
}

export const alterCountryStrength = (
  country: string,
  amount: number
): CountryAlterStrengthAction => ({
  type: COUNTRY_ALTER_STRENGTH,
  payload: {
    country,
    amount
  }
});

export const setCountryStrength = (
  country: string,
  strength: number
): CountrySetStrengthAction => ({
  type: COUNTRY_SET_STRENGTH,
  payload: {
    country,
    strength
  }
});

type CountryActions =
  | CountryAlterStrengthAction
  | GameQuitToMainMenuAction
  | CountrySetStrengthAction;

const countryReducer: Reducer<typeof defaultState, CountryActions> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case GAME_QUIT_TO_MAIN_MENU:
      return defaultState;

    case COUNTRY_SET_STRENGTH:
      return state.setIn(
        ["countries", action.payload.country, "strength"],
        action.payload.strength
      );

    case COUNTRY_ALTER_STRENGTH:
      return state.updateIn(
        ["countries", action.payload.country, "strength"],
        (s) => s + action.payload.amount
      );

    default:
      return defaultState;
  }
};

export default countryReducer;
