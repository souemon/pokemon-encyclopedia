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
    const mockPokemonImage = "testUrl";
    vi.mocked(fetchPokemonList).mockResolvedValue(
      mockFetchListPageItemResponse
    );
    vi.mocked(fetchName).mockResolvedValue(mockPokemonName);
    vi.mocked(fetchImage).mockResolvedValue(mockPokemonImage);
    describe("正常系", () => {
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
  });
});
