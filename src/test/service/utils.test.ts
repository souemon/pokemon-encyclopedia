import { extractIdFromUrl, getJapaneseValue } from "@/service/utils";

describe("utils", () => {
  describe("extractIdFromUrl", () => {
    const baseUrl: string = "https://pokeapi.co/api/v2/pokemon/";
    test.each([
      {
        url: baseUrl + "1/",
        expected: "1",
        description: "末尾スラッシュあり",
      },
      {
        url: baseUrl + "9999",
        expected: "9999",
        description: "末尾スラッシュなし",
      },
    ])(
      "URLの末尾の図鑑No.が取得できること。（$description)",
      ({ url, expected }) => {
        expect(extractIdFromUrl(url)).toBe(expected);
      }
    );
  });

  describe("getJapaneseValue", () => {
    const genera: Genera = [
      {
        genus: "Overgrow",
        language: { name: "en" },
      },
      {
        genus: "しんりょく",
        language: { name: "ja" },
      },
    ];
    const type: Type = [
      {
        name: "Bulbasaur",
        language: { name: "en" },
      },
      {
        name: "フシギダネ",
        language: { name: "ja" },
      },
    ];
    test.each([
      { description: "genus", input: genera, expected: "しんりょく" },
      { description: "name", input: type, expected: "フシギダネ" },
    ])(
      "日本語名が正常に取得できていること（$description）",
      ({ input, expected }) => {
        expect(getJapaneseValue(input)).toBe(expected);
      }
    );
  });
});
