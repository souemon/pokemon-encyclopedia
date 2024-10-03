import { fetchListPageItem, fetchDetailPageItem } from "@/service/index";

vi.mock("@/service/pokemon");
import {
  fetchTypes,
  fetchAbilities,
  fetchImage,
  self as Pokemon,
  fetchPokemonList,
} from "@/service/pokemon";

vi.mock("@/service/species");
import {
  self as PokemonSpecies,
  fetchName,
  fetchGenera,
} from "@/service/species";

describe("index.ts", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchListPageItem", () => {
    const mockPokemonNumber = "1";
    const mockPokemon = {
      name: "test",
      url: `test:/url/test/${mockPokemonNumber}`,
    };
    const mockPokemonList = Array(20).fill(mockPokemon);
    const nextUrl = "nextUrl";
    const mockFetchListPageItemResponse = {
      pokemonList: mockPokemonList,
      nextUrl: nextUrl,
    };
    const mockPokemonName = "testNameJa";
    const mockPokemonImage = "testImage";

    describe("正常系", () => {
      beforeEach(() => {
        vi.mocked(fetchPokemonList).mockResolvedValue(
          mockFetchListPageItemResponse
        );
        vi.mocked(fetchName).mockResolvedValue(mockPokemonName);
        vi.mocked(fetchImage).mockResolvedValue(mockPokemonImage);
      });

      test("_nextUrlを引数で受け取らなかった場合、引数なしでfetchPokemonSpecies関数を呼ぶこと", async () => {
        await fetchListPageItem();
        expect(fetchPokemonList).toHaveBeenCalledTimes(1);
        expect(fetchPokemonList).toHaveBeenCalledWith();
      });
      test("nextUrlを引数で受け取った場合、nextUrlを引数としてfetchPokemonSpecies関数を呼ぶこと", async () => {
        await fetchListPageItem(nextUrl);
        expect(fetchPokemonList).toHaveBeenCalledTimes(1);
        expect(fetchPokemonList).toHaveBeenCalledWith(nextUrl);
      });
      test("fetchName関数に引数idを正しく渡していること", async () => {
        await fetchListPageItem();
        expect(fetchName).toHaveBeenCalledTimes(20);
        expect(fetchName).toHaveBeenCalledWith(mockPokemonNumber);
      });
      test("fetchImage関数に引数idを正しく渡していること", async () => {
        await fetchListPageItem();
        expect(fetchImage).toHaveBeenCalledTimes(20);
        expect(fetchImage).toHaveBeenCalledWith(mockPokemonNumber);
      });
      test("ポケモンのリストと次のURLを要素に持つオブジェクトを返却していること", async () => {
        const mockProcessedPokemonItem = {
          id: mockPokemonNumber,
          name: mockPokemonName,
          image: mockPokemonImage,
        };
        const mockProcessedPokemonList = Array(20).fill(
          mockProcessedPokemonItem
        );
        const expectedReturn = {
          processedPokemonList: mockProcessedPokemonList,
          nextUrl,
        };
        const result = await fetchListPageItem();
        expect(result).toEqual(expectedReturn);
      });
    });

    // 今の実装だとあまり意味のないケースかも
    describe("異常系", () => {
      test("fetchPokemonList関数でundefinedを受け取った場合、undefinedを返却すること", async () => {
        vi.mocked(fetchPokemonList).mockResolvedValue(undefined);
        const result = await fetchListPageItem();
        expect(fetchPokemonList).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
      });
      test("fetchName関数とfetchImage関数でundefinedを受け取った場合、返却するポケモンのリストのnameの値がundefinedとなっていること", async () => {
        const mockProcessedPokemonItem = {
          id: mockPokemonNumber,
          name: undefined,
          image: undefined,
        };
        const mockProcessedPokemonList = Array(20).fill(
          mockProcessedPokemonItem
        );
        const expectedReturn = {
          processedPokemonList: mockProcessedPokemonList,
          nextUrl,
        };
        vi.mocked(fetchPokemonList).mockResolvedValue(
          mockFetchListPageItemResponse
        );
        vi.mocked(fetchName).mockResolvedValue(undefined);
        vi.mocked(fetchImage).mockResolvedValue(undefined);
        const result = await fetchListPageItem();
        expect(fetchPokemonList).toHaveBeenCalledTimes(1);
        expect(fetchName).toHaveBeenCalledTimes(20);
        expect(fetchName).toHaveBeenCalledWith(mockPokemonNumber);
        expect(fetchImage).toHaveBeenCalledTimes(20);
        expect(fetchImage).toHaveBeenCalledWith(mockPokemonNumber);
        expect(result).toEqual(expectedReturn);
      });
    });
  });

  describe("fetchDetailPageItem", () => {
    const id = "1";
    const mockPokemonName = "testNameJa";
    const mockPokemonGenera = "testGenusJa";
    const mockPokemonImage = "testImage";
    const mockPokemonBaseInfo: Pokemon = {
      sprites: {
        other: { "official-artwork": { front_default: mockPokemonImage } },
      },
      abilities: [
        { ability: { url: "testUrl1" } },
        { ability: { url: "testUrl2" } },
      ],
      types: [{ type: { url: "testUrl1" } }, { type: { url: "testUrl2" } }],
    };
    const mockPokemonSpecies: PokemonSpecies = {
      names: [
        { name: "testNameEn", language: { name: "en" } },
        { name: mockPokemonName, language: { name: "ja" } },
      ],
      genera: [
        { genus: "testGenusEn", language: { name: "en" } },
        { genus: mockPokemonGenera, language: { name: "ja" } },
      ],
    };
    const mockPokemonTypes = ["testTypeJa", "testTypeJa"];
    const mockPokemonAbilities = ["testAbilityJa", "testAbilityJa"];

    describe("正常系", () => {
      beforeEach(() => {
        vi.mocked(Pokemon.fetchPokemon).mockResolvedValue(mockPokemonBaseInfo);
        vi.mocked(PokemonSpecies.fetchPokemonSpecies).mockResolvedValue(
          mockPokemonSpecies
        );
        vi.mocked(fetchName).mockResolvedValue(mockPokemonName);
        vi.mocked(fetchGenera).mockResolvedValue(mockPokemonGenera);
        vi.mocked(fetchImage).mockResolvedValue(mockPokemonImage);
        vi.mocked(fetchTypes).mockResolvedValue(mockPokemonTypes);
        vi.mocked(fetchAbilities).mockResolvedValue(mockPokemonAbilities);
      });

      test("fetchPokemon関数を正しい引数(id)で呼ぶこと", async () => {
        await fetchDetailPageItem(id);
        expect(Pokemon.fetchPokemon).toHaveBeenCalledTimes(1);
        expect(Pokemon.fetchPokemon).toHaveBeenCalledWith(id);
      });
      test("fetchPokemonSpecies関数を正しい引数(id)で呼ぶこと", async () => {
        await fetchDetailPageItem(id);
        expect(PokemonSpecies.fetchPokemonSpecies).toHaveBeenCalledTimes(1);
        expect(PokemonSpecies.fetchPokemonSpecies).toHaveBeenCalledWith(id);
      });
      test("fetchName関数に引数idを正しく渡していること", async () => {
        await fetchDetailPageItem(id);
        expect(fetchName).toHaveBeenCalledWith(id, mockPokemonSpecies);
      });
      test("fetchGenera関数に引数idを正しく渡していること", async () => {
        await fetchDetailPageItem(id);
        expect(fetchGenera).toHaveBeenCalledWith(id, mockPokemonSpecies);
      });
      test("fetchImage関数に引数idを正しく渡していること", async () => {
        await fetchDetailPageItem(id);
        expect(fetchImage).toHaveBeenCalledWith(id, mockPokemonBaseInfo);
      });
      test("fetchTypes関数に引数idを正しく渡していること", async () => {
        await fetchDetailPageItem(id);
        expect(fetchTypes).toHaveBeenCalledWith(id, mockPokemonBaseInfo);
      });
      test("fetchAbilities関数に引数idを正しく渡していること", async () => {
        await fetchDetailPageItem(id);
        expect(fetchAbilities).toHaveBeenCalledWith(id, mockPokemonBaseInfo);
      });
      test("詳細画面の表示に必要なデータが揃ったオブジェクトを返却していること", async () => {
        const expectedReturn = {
          id,
          name: mockPokemonName,
          genera: mockPokemonGenera,
          image: mockPokemonImage,
          types: mockPokemonTypes,
          abilities: mockPokemonAbilities,
        };
        const result = await fetchDetailPageItem(id);
        expect(result).toEqual(expectedReturn);
      });
    });

    // 今の実装だとあまり意味のないケースかも
    describe("異常系", () => {
      test("fetchPokemon関数でundefinedを受け取った場合、undefinedを返却すること", async () => {
        vi.mocked(Pokemon.fetchPokemon).mockResolvedValue(undefined);
        const result = await fetchDetailPageItem(id);
        expect(Pokemon.fetchPokemon).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
      });
      test("fetchPokemonSpecies関数でundefinedを受け取った場合、undefinedを返却すること", async () => {
        vi.mocked(Pokemon.fetchPokemon).mockResolvedValue(mockPokemonBaseInfo);
        vi.mocked(PokemonSpecies.fetchPokemonSpecies).mockResolvedValue(
          undefined
        );
        const result = await fetchDetailPageItem(id);
        expect(PokemonSpecies.fetchPokemonSpecies).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
      });
      test("各種情報でundefinedを受け取った場合、返却するポケモンのオブジェクトの各要素がundefinedとなっていること", async () => {
        const expectedReturn = {
          id,
          name: undefined,
          genera: undefined,
          image: undefined,
          types: undefined,
          abilities: undefined,
        };
        vi.mocked(Pokemon.fetchPokemon).mockResolvedValue(mockPokemonBaseInfo);
        vi.mocked(PokemonSpecies.fetchPokemonSpecies).mockResolvedValue(
          mockPokemonSpecies
        );
        vi.mocked(fetchName).mockResolvedValue(undefined);
        vi.mocked(fetchGenera).mockResolvedValue(undefined);
        vi.mocked(fetchImage).mockResolvedValue(undefined);
        vi.mocked(fetchTypes).mockResolvedValue(undefined);
        vi.mocked(fetchAbilities).mockResolvedValue(undefined);

        const result = await fetchDetailPageItem(id);

        expect(result).toEqual(expectedReturn);
      });
    });
  });
});
