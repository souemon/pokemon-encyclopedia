vi.mock("axios");
import axios from "axios";
import { MockInstance } from "vitest";
import type { Mocked } from "vitest";
import type { AxiosStatic } from "axios";
import * as Pokemon from "@/service/pokemon";

const mockedAxios = axios as Mocked<AxiosStatic>;

// vite.config.tsで環境変数を設定
const VITE_POKEMON_URL = "TEST_VITE_POKEMON_URL";

describe("pokemon.ts", () => {
  const pokemonNumber = "1";
  const mockPokemonBaseInfo: Pokemon = {
    sprites: {
      other: { "official-artwork": { front_default: "testImage" } },
    },
    abilities: [
      { ability: { url: "testUrl1" } },
      { ability: { url: "testUrl2" } },
    ],
    types: [{ type: { url: "testUrl1" } }, { type: { url: "testUrl2" } }],
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("fetchPokemon", () => {
    const expectedParam = `${VITE_POKEMON_URL}/${pokemonNumber}`;
    const mockPokemon = { name: "test" };

    test("【正常系】ポケモンの基本情報オブジェクトを返すこと", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPokemon });
      const result = await Pokemon.self.fetchPokemon(pokemonNumber);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedParam);
      expect(result).toEqual(mockPokemon);
    });
    test("【異常系】axios.getに失敗したときにundefinedを返すこと", async () => {
      mockedAxios.get.mockRejectedValue(new Error("failed get"));
      const result = await Pokemon.self.fetchPokemon(pokemonNumber);
      expect(result).toBeUndefined();
    });
  });

  describe("fetchPokemonList", () => {
    const mockPokemon = { name: "test" };
    const mockPokemonList = Array(20).fill(mockPokemon);
    const nextUrl = "nextUrl";
    const mockResult = {
      data: { results: mockPokemonList, next: nextUrl },
    };

    describe("正常系", () => {
      beforeEach(() => {
        mockedAxios.get.mockResolvedValue(mockResult);
      });
      test("関数の引数なしの場合、POKEMON_URLがgetの引数となっていること", async () => {
        await Pokemon.fetchPokemonList();
        expect(mockedAxios.get).toHaveBeenCalledWith(VITE_POKEMON_URL);
      });
      test("関数の引数ありの場合、関数の引数がgetの引数となっていること", async () => {
        await Pokemon.fetchPokemonList(nextUrl);
        expect(mockedAxios.get).toHaveBeenCalledWith(nextUrl);
      });
      test("概要リストと次の20件取得用URLのオブジェクトを返すこと", async () => {
        const result = await Pokemon.fetchPokemonList();
        expect(mockedAxios.get).toHaveBeenCalledWith(VITE_POKEMON_URL);
        expect(result).toEqual({
          pokemonList: mockPokemonList,
          nextUrl: nextUrl,
        });
      });
    });
    describe("異常系", () => {
      test("axios.getに失敗したときにundefinedを返すこと", async () => {
        mockedAxios.get.mockRejectedValue(new Error("failed get"));
        const result = await Pokemon.fetchPokemonList();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("fetchTypes", () => {
    const mockFetchType: FetchType = {
      data: {
        names: [
          { name: "testType", language: { name: "en" } },
          { name: "testType", language: { name: "ja" } },
        ],
      },
    };
    describe("正常系", () => {
      type FetchPokemon = typeof Pokemon.self.fetchPokemon;
      let spyFetchPokemon: MockInstance<FetchPokemon>;
      beforeEach(() => {
        spyFetchPokemon = vi
          .spyOn(Pokemon.self, "fetchPokemon")
          .mockResolvedValue(mockPokemonBaseInfo);
      });
      test("_pokemonを引数で受け取らない場合、fetchPokemon関数を呼ぶこと", async () => {
        await Pokemon.fetchTypes(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
      });
      test("_pokemonを引数で受け取る場合、fetchPokemon関数を呼ばないこと", async () => {
        await Pokemon.fetchTypes(pokemonNumber, mockPokemonBaseInfo);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(0);
      });
      test("タイプの配列を返すこと", async () => {
        mockedAxios.get.mockResolvedValue(mockFetchType);
        const result = await Pokemon.fetchTypes(pokemonNumber);
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenNthCalledWith(1, "testUrl1");
        expect(mockedAxios.get).toHaveBeenNthCalledWith(2, "testUrl2");
        expect(result).toEqual(["testType", "testType"]);
      });
    });
    describe("異常系", () => {
      test("fetchPokemonに失敗したときにundefinedを返すこと", async () => {
        const spyFetchPokemon = vi
          .spyOn(Pokemon.self, "fetchPokemon")
          .mockRejectedValue(new Error("failed fetchPokemon"));
        const result = await Pokemon.fetchTypes(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
        expect(result).toBeUndefined();
      });
      test("axios.getに失敗したときにundefinedを返すこと", async () => {
        mockedAxios.get.mockRejectedValue(new Error("failed get"));
        vi.spyOn(Pokemon.self, "fetchPokemon").mockResolvedValue(
          mockPokemonBaseInfo
        );
        const result = await Pokemon.fetchTypes(pokemonNumber);
        expect(mockedAxios.get).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("fetchAbilities", () => {
    const mockFetchAbilities: FetchAbilities = {
      data: {
        names: [
          { name: "testAbility", language: { name: "en" } },
          { name: "testAbility", language: { name: "ja" } },
        ],
      },
    };
    describe("正常系", () => {
      type FetchPokemon = typeof Pokemon.self.fetchPokemon;
      let spyFetchPokemon: MockInstance<FetchPokemon>;
      beforeEach(() => {
        spyFetchPokemon = vi
          .spyOn(Pokemon.self, "fetchPokemon")
          .mockResolvedValue(mockPokemonBaseInfo);
      });
      test("_pokemonを引数で受け取らない場合、fetchPokemon関数を呼ぶこと", async () => {
        await Pokemon.fetchAbilities(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
      });
      test("_pokemonを引数で受け取る場合、fetchPokemon関数を呼ばないこと", async () => {
        await Pokemon.fetchAbilities(pokemonNumber, mockPokemonBaseInfo);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(0);
      });
      test("タイプの配列を返すこと", async () => {
        mockedAxios.get.mockResolvedValue(mockFetchAbilities);
        const result = await Pokemon.fetchAbilities(pokemonNumber);
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenNthCalledWith(1, "testUrl1");
        expect(mockedAxios.get).toHaveBeenNthCalledWith(2, "testUrl2");
        expect(result).toEqual(["testAbility", "testAbility"]);
      });
    });
    describe("異常系", () => {
      test("fetchPokemonに失敗したときにundefinedを返すこと", async () => {
        const spyFetchPokemon = vi
          .spyOn(Pokemon.self, "fetchPokemon")
          .mockRejectedValue(new Error("failed fetchPokemon"));
        const result = await Pokemon.fetchAbilities(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
        expect(result).toBeUndefined();
      });
      test("axios.getに失敗したときにundefinedを返すこと", async () => {
        mockedAxios.get.mockRejectedValue(new Error("failed get"));
        vi.spyOn(Pokemon.self, "fetchPokemon").mockResolvedValue(
          mockPokemonBaseInfo
        );
        const result = await Pokemon.fetchAbilities(pokemonNumber);
        expect(mockedAxios.get).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });
  });

  describe("fetchImage", () => {
    describe("正常系", () => {
      type FetchPokemon = typeof Pokemon.self.fetchPokemon;
      let spyFetchPokemon: MockInstance<FetchPokemon>;
      beforeEach(() => {
        spyFetchPokemon = vi
          .spyOn(Pokemon.self, "fetchPokemon")
          .mockResolvedValue(mockPokemonBaseInfo);
      });
      test("_pokemonを引数で受け取らない場合、fetchPokemon関数を呼ぶこと", async () => {
        await Pokemon.fetchImage(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
      });
      test("_pokemonを引数で受け取る場合、fetchPokemon関数を呼ばないこと", async () => {
        await Pokemon.fetchImage(pokemonNumber, mockPokemonBaseInfo);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(0);
      });
      test("画像のURLを返すこと", async () => {
        const result = await Pokemon.fetchImage(pokemonNumber);
        expect(result).toBe("testImage");
      });
    });
    describe("異常系", () => {
      test("fetchPokemonに失敗したときにundefinedを返すこと", async () => {
        const spyFetchPokemon = vi
          .spyOn(Pokemon.self, "fetchPokemon")
          .mockRejectedValue(new Error("failed fetchPokemon"));
        const result = await Pokemon.fetchImage(pokemonNumber);
        expect(spyFetchPokemon).toHaveBeenCalledTimes(1);
        expect(spyFetchPokemon).toHaveBeenCalledWith(pokemonNumber);
        expect(result).toBeUndefined();
      });
    });
  });
});
