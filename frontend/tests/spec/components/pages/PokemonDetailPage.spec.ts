import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import PokemonDetailPage from "@pages/PokemonDetailPage.vue";
import { fetchDetailPageItem } from "@/service/index";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("PokemonDetailPage", () => {
  const detailPageItem: DetailPokemon = {
    id: "1",
    name: "nameJa",
    image: "image",
    genera: "generaJa",
    types: ["typeJa1", "typeJa2"],
    abilities: ["abilityJa1", "abilityJa2"],
  };
  vi.mock("@/service/index");
  vi.mocked(fetchDetailPageItem).mockResolvedValue(detailPageItem);

  vi.mock("vue-router", () => ({
    useRoute: vi.fn().mockReturnValue({
      params: {
        id: "1",
      },
    }),
  }));
  const wrapper = mount(PokemonDetailPage, {
    global: {
      plugins: [vuetify],
    },
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("初期表示", () => {
    test("マウント時にfetchDetailPageItemが呼ばれていること", () => {
      expect(fetchDetailPageItem).toHaveBeenCalledTimes(1);
      expect(fetchDetailPageItem).toHaveBeenCalledWith("1");
    });

    test("ポケモンの名前が正しく表示されていること", async () => {
      expect(wrapper.text()).toContain(`No.${detailPageItem.id}`);
    });

    test("ポケモンの名前が正しく表示されていること", async () => {
      expect(wrapper.text()).toContain(detailPageItem.name);
    });

    test("ポケモンの画像が正しく表示されていること", async () => {
      const img = wrapper.find("img");
      expect(img.attributes("src")).toBe(detailPageItem.image);
    });
    test("ポケモンのタイプが正しく表示されていること", async () => {
      expect(wrapper.text()).toContain(detailPageItem.types![0]);
      expect(wrapper.text()).toContain(detailPageItem.types![1]);
    });
    test("ポケモンの特性が正しく表示されていること", async () => {
      expect(wrapper.text()).toContain(detailPageItem.abilities![0]);
      expect(wrapper.text()).toContain(detailPageItem.abilities![1]);
    });
  });
});
