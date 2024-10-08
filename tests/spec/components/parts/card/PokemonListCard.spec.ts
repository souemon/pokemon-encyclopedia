import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import PokemonListCard from "@parts/card/PokemonListCard.vue";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("PokemonListCard", () => {
  const id = "1";
  const name = "bulbasaur";
  const image = "imageUrl";
  const wrapper = mount(PokemonListCard, {
    propsData: {
      id,
      name,
      image,
    },
    global: {
      plugins: [vuetify],
    },
  });
  test("propsで受け取った「図鑑No.」を表示していること", () => {
    expect(wrapper.get(".v-card-subtitle").text()).toMatch(`No.${id}`);
  });
  test("propsで受け取った「名前」を表示していること", () => {
    expect(wrapper.get(".v-card-title").text()).toMatch(name);
  });
  test("propsで受け取った「画像」を表示していること", () => {
    expect(wrapper.get("img").attributes("src")).toMatch(image);
  });
});
