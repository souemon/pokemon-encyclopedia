import { extractIdFromUrl } from "@/service/utils";
import {
  fetchTypes,
  fetchAbilities,
  fetchImage,
  fetchPokemon,
  fetchPokemonList,
} from "@/service/pokemon";
import { fetchPokemonSpecies, fetchName, fetchGenera } from "@/service/species";

// 一覧画面表示用データの取得
const fetchListPageItem = async (
  _nextUrl?: string
): Promise<ListPageItem | undefined> => {
  const result = _nextUrl
    ? await fetchPokemonList(_nextUrl)
    : await fetchPokemonList();
  if (!result) return undefined;
  const nextUrl = result.nextUrl;
  const pokemonList: PokemonList = result.pokemonList;
  const processedPokemonList = await Promise.all(
    pokemonList.map(async (pokemonOutline: PokemonOutline) => {
      const id = extractIdFromUrl(pokemonOutline.url);
      const name = await fetchName(id);
      const image = await fetchImage(id);
      return { id, name, image };
    })
  );
  return { processedPokemonList, nextUrl };
};

// 詳細画面表示用データの取得
const fetchDetailPageItem = async (
  id: string
): Promise<DetailPokemon | undefined> => {
  const pokemon = await fetchPokemon(id);
  if (!pokemon) return undefined;
  const pokemonSpecies = await fetchPokemonSpecies(id);
  if (!pokemonSpecies) return undefined;
  const name = await fetchName(id, pokemonSpecies); // 名前
  const genera = await fetchGenera(id, pokemonSpecies); // 分類
  const image = await fetchImage(id, pokemon); // 画像
  const types = await fetchTypes(id, pokemon); // タイプ
  const abilities = await fetchAbilities(id, pokemon); // 特性
  return { id, name, genera, image, types, abilities };
};

export { fetchListPageItem, fetchDetailPageItem };
