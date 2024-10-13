import { mount } from "@vue/test-utils";
import Header from "@globals/Header.vue";
import router from "@/router";

global.ResizeObserver = require("resize-observer-polyfill");

describe("PokemonListCard", () => {
  const wrapper = mount(Header, {
    global: {
      plugins: [router],
    },
  });

  test("タイトル「ポケモン図鑑」が表示されていること", () => {
    expect(wrapper.get("a").text()).toBe("ポケモン図鑑");
  });

  // もう少し良いテスト方法があれば知りたい・・・（うまく書けなかったです）
  test("カードのURLが正しい遷移先のURLとなっていること", async () => {
    expect(wrapper.get("a").attributes("href")).toBe("/vue-poke-app/");
  });
});
