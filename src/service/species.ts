import axios from "axios";
import { getJapaneseValue } from "@/service/utils";

const SPECIES_URL = import.meta.env.VITE_SPECIES_URL;

// ポケモンの種類(英語)を取得する関数
const fetchPokemonSpecies = async (
  id: string
): Promise<PokemonSpecies | undefined> => {
  let pokemonSpecies;
  try {
    pokemonSpecies = (await axios.get(`${SPECIES_URL}/${id}`)).data;
  } catch (error) {
    pokemonSpecies = undefined;
  }
  return pokemonSpecies;
};

// 別モジュールにすべきかも（https://makky12.hatenablog.com/entry/2021/02/08/120500）
const self = {
  fetchPokemonSpecies,
};

// 「名前」を取得する関数
const fetchName = async (
  id: string,
  _pokemonSpecies?: PokemonSpecies
): Promise<string | undefined> => {
  let name: string | undefined;
  try {
    const pokemonSpecies: PokemonSpecies | undefined = _pokemonSpecies
      ? await _pokemonSpecies
      : await fetchPokemonSpecies(id);
    if (!pokemonSpecies) return undefined;
    name = getJapaneseValue(pokemonSpecies.names);
  } catch (error) {
    name = undefined;
  }
  return name;
};

// 「分類」を取得する関数
const fetchGenera = async (
  id: string,
  _pokemonSpecies?: PokemonSpecies
): Promise<string | undefined> => {
  let genera: string | undefined;
  try {
    const pokemonSpecies: PokemonSpecies | undefined = _pokemonSpecies
      ? await _pokemonSpecies
      : await fetchPokemonSpecies(id);
    if (!pokemonSpecies) return undefined;
    genera = getJapaneseValue(pokemonSpecies.genera);
  } catch (error) {
    genera = undefined;
  }
  return genera;
};

export { self, fetchName, fetchGenera };
