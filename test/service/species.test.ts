vi.mock("axios");
import axios from "axios";
import { MockInstance } from "vitest";
import type { Mocked } from "vitest";
import type { AxiosStatic } from "axios";
import * as Species from "@/service/species";

const mockedAxios = axios as Mocked<AxiosStatic>;

// vite.config.tsで環境変数を設定
const VITE_SPECIES_URL = "TEST_VITE_SPECIES_URL";

describe("species.ts", () => {
  const pokemonNumber = "1";
  const mockPokemonSpecies: PokemonSpecies = {
    names: [
      { name: "testNameEn", language: { name: "en" } },
      { name: "testNameJa", language: { name: "ja" } },
    ],
    genera: [
      { genus: "testGenusEn", language: { name: "en" } },
      { genus: "testGenusJa", language: { name: "ja" } },
    ],
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("fetchPokemonSpecies", () => {
    const expectedParam = `${VITE_SPECIES_URL}/${pokemonNumber}`;

    test("【正常系】ポケモンの基本情報オブジェクトを返すこと", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPokemonSpecies });
      const result = await Species.self.fetchPokemonSpecies(pokemonNumber);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedParam);
      expect(result).toEqual(mockPokemonSpecies);
    });
    test("【異常系】axios.getに失敗したときにundefinedを返すこと", async () => {
      mockedAxios.get.mockRejectedValue(new Error("failed get"));
      const result = await Species.self.fetchPokemonSpecies(pokemonNumber);
      expect(result).toBeUndefined();
    });
  });

  describe("fetchName", () => {
    describe("正常系", () => {
      type FetchPokemonSpecies = typeof Species.self.fetchPokemonSpecies;
      let spyFetchPokemonSpecies: MockInstance<FetchPokemonSpecies>;
      beforeEach(() => {
        spyFetchPokemonSpecies = vi
          .spyOn(Species.self, "fetchPokemonSpecies")
          .mockResolvedValue(mockPokemonSpecies);
      });
      test("_pokemonを引数で受け取らない場合、fetchPokemonSpecies関数を呼ぶこと", async () => {
        await Species.fetchName(pokemonNumber);
        expect(spyFetchPokemonSpecies).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemonSpecies).toHaveBeenCalledWith(pokemonNumber);
      });
      test("_pokemonを引数で受け取る場合、fetchPokemonSpecies関数を呼ばないこと", async () => {
        await Species.fetchName(pokemonNumber, mockPokemonSpecies);
        expect(spyFetchPokemonSpecies).toHaveBeenCalledTimes(0);
      });
      test("名前を返すこと", async () => {
        const result = await Species.fetchName(pokemonNumber);
        expect(result).toBe("testNameJa");
      });
    });
    describe("異常系", () => {
      test("fetchPokemonSpeciesに失敗したときにundefinedを返すこと", async () => {
        const spyFetchPokemon = vi
          .spyOn(Species.self, "fetchPokemonSpecies")
          .mockRejectedValue(new Error("failed fetchPokemonSpecies"));
        const result = await Species.fetchName(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
        expect(result).toBeUndefined();
      });
    });
  });

  describe("fetchGenera", () => {
    describe("正常系", () => {
      type FetchPokemonSpecies = typeof Species.self.fetchPokemonSpecies;
      let spyFetchPokemonSpecies: MockInstance<FetchPokemonSpecies>;
      beforeEach(() => {
        spyFetchPokemonSpecies = vi
          .spyOn(Species.self, "fetchPokemonSpecies")
          .mockResolvedValue(mockPokemonSpecies);
      });
      test("_pokemonを引数で受け取らない場合、fetchPokemonSpecies関数を呼ぶこと", async () => {
        await Species.fetchGenera(pokemonNumber);
        expect(spyFetchPokemonSpecies).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemonSpecies).toHaveBeenCalledWith(pokemonNumber);
      });
      test("_pokemonを引数で受け取る場合、fetchPokemonSpecies関数を呼ばないこと", async () => {
        await Species.fetchGenera(pokemonNumber, mockPokemonSpecies);
        expect(spyFetchPokemonSpecies).toHaveBeenCalledTimes(0);
      });
      test("分類を返すこと", async () => {
        const result = await Species.fetchGenera(pokemonNumber);
        expect(result).toBe("testGenusJa");
      });
    });
    describe("異常系", () => {
      test("fetchPokemonSpeciesに失敗したときにundefinedを返すこと", async () => {
        const spyFetchPokemon = vi
          .spyOn(Species.self, "fetchPokemonSpecies")
          .mockRejectedValue(new Error("failed fetchPokemonSpecies"));
        const result = await Species.fetchGenera(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
        expect(result).toBeUndefined();
      });
    });
  });
});
