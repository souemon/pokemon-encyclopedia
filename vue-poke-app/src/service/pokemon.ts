import axios from "axios";
import { getJapaneseValue } from "@/service/utils";

const POKEMON_URL = import.meta.env.VITE_POKEMON_URL;

// 「タイプ」を取得する関数
const fetchTypes = async (
  id: string,
  _pokemon?: Pokemon
): Promise<string[] | undefined> => {
  let types: string[] = [];
  try {
    const pokemon = _pokemon ? await _pokemon : await fetchPokemon(id);
    if (!pokemon) return undefined;
    const urls: string[] = pokemon.types.map((data) => data.type.url);
    urls.forEach(async (url) => {
      const response: FetchType = await axios.get(url);
      const names: Type = response.data.names;
      const type = getJapaneseValue(names);
      if (type) {
        types.push(type);
      }
    });
    return types;
  } catch (error) {
    return undefined;
  }
};

// 「特性」を取得する関数
const fetchAbilities = async (
  id: string,
  _pokemon?: Pokemon
): Promise<string[] | undefined> => {
  let abilities: string[] = [];
  try {
    const pokemon = _pokemon ? await _pokemon : await fetchPokemon(id);
    if (!pokemon) return undefined;
    const urls: string[] = pokemon.abilities.map((item) => item.ability.url);
    urls.forEach(async (url) => {
      const response: FetchAbilities = await axios.get(url);
      const names: Ability = response.data.names;
      const ability = getJapaneseValue(names);
      if (ability) {
        abilities.push(ability);
      }
    });
    return abilities;
  } catch (error) {
    return undefined;
  }
};

// 「画像」を取得する関数
const fetchImage = async (
  id: string,
  _pokemon?: Pokemon
): Promise<string | undefined> => {
  let image;
  try {
    const pokemon = _pokemon ? await _pokemon : await fetchPokemon(id);
    if (!pokemon) return undefined;
    image = pokemon.sprites.other["official-artwork"].front_default;
  } catch (error) {
    image = undefined;
  }
  return image;
};

// ポケモンの基本情報(英語)を取得する関数
const fetchPokemon = async (id: string): Promise<Pokemon | undefined> => {
  let pokemon;
  try {
    pokemon = (await axios.get(`${POKEMON_URL}/${id}`)).data;
  } catch (error) {
    pokemon = undefined;
  }
  return pokemon;
};

// ポケモンの概要リスト(英語)を20件取得する関数
const fetchPokemonList = async (
  _nextUrl?: string
): Promise<{ pokemonList: PokemonList; nextUrl: string } | undefined> => {
  let result;
  try {
    const response: PokemonListData = _nextUrl
      ? (await axios.get(_nextUrl)).data
      : (await axios.get(POKEMON_URL)).data;
    result = {
      pokemonList: response.results,
      nextUrl: response.next,
    };
  } catch (error) {
    result = undefined;
  }
  return result;
};

export {
  fetchTypes,
  fetchAbilities,
  fetchImage,
  fetchPokemon,
  fetchPokemonList,
};
