import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import PokemonListPage from "@pages/PokemonListPage.vue";
import PokemonListCard from "@parts/card/PokemonListCard.vue";
import { fetchListPageItem } from "@/service/index";

// wrapper.vm.[プロパティ]で型エラーを出さないための型定義
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    nextUrl: string;
  }
}

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("PokemonListPage", () => {
  const mockPokemonName = "testNameJa";
  const mockPokemonImage = "testImage";
  const nextUrl = "nextUrl";
  const mockProcessedPokemonItem = {
    id: "0",
    name: mockPokemonName,
    image: mockPokemonImage,
  };
  let mockProcessedPokemonList = [];
  for (let i = 0; i < 20; i++) {
    mockProcessedPokemonList.push(structuredClone(mockProcessedPokemonItem));
  }
  mockProcessedPokemonList.forEach((item, index) => {
    item.id = String(index + 1);
  });
  const fetchListPageItemReturnValue = {
    processedPokemonList: mockProcessedPokemonList,
    nextUrl,
  };
  vi.mock("@/service/index");
  vi.mocked(fetchListPageItem).mockResolvedValue(fetchListPageItemReturnValue);
  const wrapper = mount(PokemonListPage, {
    global: {
      plugins: [vuetify],
      components: {
        PokemonListCard,
      },
    },
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("初期表示", () => {
    test("マウント時にfetchListPageItemが呼ばれていること", () => {
      expect(fetchListPageItem).toHaveBeenCalledTimes(1);
    });

    test("初期表示でポケモンの概要情報が20件表示されていること", () => {
      const pokemonListCards = wrapper.findAllComponents(PokemonListCard);
      expect(pokemonListCards.length).toBe(20);
    });

    test("次のページのURLが正しいこと", () => {
      expect(wrapper.vm.nextUrl).toBe(nextUrl);
    });

    test("ポケモンカードの内容が正しいこと", () => {
      const pokemonListCards = wrapper.findAllComponents(PokemonListCard);
      pokemonListCards.forEach((card, index) => {
        expect(card.props().id).toBe(String(index + 1));
        expect(card.props().name).toBe(mockPokemonName);
        expect(card.props().image).toBe(mockPokemonImage);
      });
    });
  });

  describe("イベント実行時", () => {
    test("「さらに表示」ボタンがクリックされたときfetchPokemonDetails関数内でfetchListPageItem関数が呼ばれること", async () => {
      const nextButton = wrapper.get("button");
      vi.clearAllMocks(); // ononMountedで呼ばれたfetchListPageItemをクリア
      await nextButton.trigger("click");
      expect(nextButton.text()).toBe("さらに表示");
      expect(fetchListPageItem).toHaveBeenCalledTimes(1);
    });
  });
});
