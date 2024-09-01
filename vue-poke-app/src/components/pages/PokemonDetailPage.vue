<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const parameter = route.params;
// パラメータからid（No.）を取得
const id = ref<string>(parameter.id as string);

const japaneseName = ref<string>("");
const image = ref<string>("");
const genus = ref<string>("");
const types = reactive<string[]>([]);
const abilities = reactive<string[]>([]);

/* url */
const baseUrl = "https://pokeapi.co/api/v2";
const japaneseNameUrl = `${baseUrl}/pokemon-species/${id.value}/`; // 名前(日本語)
const imageAndTypeAndAbilitiesUrl = `${baseUrl}/pokemon/${id.value}/`; // 画像 and タイプ and 特性
const generaUrl = `https://pokeapi.co/api/v2/pokemon-species/${id.value}/`; // 分類

onMounted(async () => {
  // 名前(日本語)の取得
  const responseForJapaneseName = await axios.get(japaneseNameUrl);
  japaneseName.value = responseForJapaneseName.data.names.find(
    (name: { language: { name: string } }) => name.language.name === "ja"
  ).name;

  // 分類の取得
  const responseForGenera = await axios.get(generaUrl);
  genus.value = responseForGenera.data.genera.find(
    (genera: { genus: string; language: { name: string } }) =>
      genera.language.name === "ja"
  ).genus;

  /* タイプ(日本語)と特性(日本語)と画像用のURLの取得 */
  const responseForImageAndTypeAndAbilities = await axios.get(
    imageAndTypeAndAbilitiesUrl
  );
  // タイプ(日本語)用URL
  const japaneseTypeUrlArray: string[] =
    responseForImageAndTypeAndAbilities.data.types.map(
      (item: { type: { url: string } }) => item.type.url
    );
  // 日本語タイプ名の取得
  japaneseTypeUrlArray.forEach(async (japaneseTypeUrl) => {
    const responseForjapaneseType = await axios.get(japaneseTypeUrl);
    const type = responseForjapaneseType.data.names.find(
      (name: { language: { name: string } }) => name.language.name === "ja"
    ).name;
    types.push(type);
  });
  // 特性(日本語)用URL
  const japaneseAbilitiesUrlArray: string[] =
    responseForImageAndTypeAndAbilities.data.abilities.map(
      (item: { ability: { url: string } }) => item.ability.url
    );

  // 特性(日本語)の取得
  japaneseAbilitiesUrlArray.forEach(async (japaneseAbilitiesUrl) => {
    const responseForjapaneseAbilitie = await axios.get(japaneseAbilitiesUrl);
    const ability = responseForjapaneseAbilitie.data.names.find(
      (name: { language: { name: string } }) => name.language.name === "ja"
    ).name;
    abilities.push(ability);
  });

  // 画像取得
  image.value =
    responseForImageAndTypeAndAbilities.data.sprites.other[
      "official-artwork"
    ].front_default;
});
</script>

<template>
  <v-container>
    <v-card class="mx-auto" max-width="45vw" elevation="3">
      <v-sheet width="45vw">
        <v-row>
          <v-col cols="6">
            <!-- No. -->
            <div id="card_subtitle" class="mt-6 ml-10 font-weight-bold">
              No.{{ id }}
            </div>

            <!-- 名前 -->
            <v-card-title id="card_title" class="ml-5 font-weight-bold">
              {{ japaneseName }}
            </v-card-title>

            <!-- 分類 -->
            <div class="detail_info mt-5 ml-10 font-weight-bold">
              <p>▼分類</p>
              <span>{{ genus }}</span>
            </div>

            <!-- タイプ -->
            <div class="detail_info mt-8 ml-10 font-weight-bold">
              <p>▼タイプ</p>
              <template v-for="tp in types">
                <span>{{ tp }}</span
                ><br />
              </template>
            </div>

            <!-- 特性 -->
            <div class="detail_info mt-8 mb-12 ml-10 font-weight-bold">
              <p>▼特性</p>
              <template v-for="ability in abilities">
                <span>{{ ability }}</span
                ><br />
              </template>
            </div>
          </v-col>

          <!-- 画像 -->
          <v-col cols="6" class="d-flex justify-end align-center">
            <v-img class="mr-10" :src="image"></v-img>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<style scoped>
#card_subtitle {
  font-size: 1.6vw;
  color: #000000 !important;
}
#card_title {
  font-size: 2.4vw;
}
.detail_info {
  font-size: 1.4vw;
}
</style>
