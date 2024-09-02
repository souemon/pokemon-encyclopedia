import axios from "axios";
import { getJapaneseValue } from "@/service/utils";

const SPECIESI_URL = import.meta.env.VITE_SPECIESI_URL;

// ポケモンの種類(英語)を取得する関数
const fetchPokemonSpecies = async (id: string): Promise<PokemonSpecies> => {
  const pokemonSpecies = (await axios.get(`${SPECIESI_URL}/${id}`)).data;
  return pokemonSpecies;
};

// 「名前」を取得する関数
const fetchName = async (
  id: string,
  _pokemonSpecies?: PokemonSpecies
): Promise<string | undefined> => {
  let name: string | undefined;
  try {
    const pokemonSpecies: PokemonSpecies = _pokemonSpecies
      ? await _pokemonSpecies
      : await fetchPokemonSpecies(id);
    name = getJapaneseValue(pokemonSpecies.names);
  } catch (error) {
    name = undefined;
  }
  return name;
};

// 「分類」を取得する関数
const fetchSpecies = async (
  id: string,
  _pokemonSpecies?: PokemonSpecies
): Promise<string | undefined> => {
  let genera: string | undefined;
  try {
    const pokemonSpecies: PokemonSpecies = _pokemonSpecies
      ? await _pokemonSpecies
      : await fetchPokemonSpecies(id);
    genera = getJapaneseValue(pokemonSpecies.genera);
  } catch (error) {
    genera = undefined;
  }
  return genera;
};

export { fetchPokemonSpecies, fetchName, fetchSpecies };
