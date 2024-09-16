<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchDetailPageItem } from "@/service/index";

const route = useRoute();
const parameter = route.params;
const id = ref<string>(parameter.id as string); // パラメータからid（No.）を取得

const name = ref<string | undefined>("");
const image = ref<string | undefined>("");
const genera = ref<string | undefined>("");
const types = reactive<string[]>([]);
const abilities = reactive<string[]>([]);

onMounted(async () => {
  const detailPageItem: DetailPokemon | undefined = await fetchDetailPageItem(
    id.value
  );
  if (!detailPageItem) {
    name.value = "????";
    image.value = "????";
    genera.value = "????";
    types.push("????");
    abilities.push("????");
    return;
  }
  name.value = detailPageItem.name;
  image.value = detailPageItem.image;
  genera.value = detailPageItem.genera;
  if (detailPageItem.types) {
    detailPageItem.types.forEach((type) => types.push(type));
  } else {
    types.push("????");
  }
  if (detailPageItem.abilities) {
    detailPageItem.abilities.forEach((ability) => abilities.push(ability));
  } else {
    abilities.push("????");
  }
});
</script>

<template>
  <v-container>
    <v-card class="mx-auto" max-width="80vw" elevation="3">
      <v-sheet width="70vw">
        <v-row>
          <v-col cols="6">
            <!-- No. -->
            <div id="card_subtitle" class="mt-6 ml-9 font-weight-bold">
              No.{{ id }}
            </div>

            <!-- 名前 -->
            <v-card-title id="card_title" class="ml-5 font-weight-bold">
              {{ name }}
            </v-card-title>

            <!-- 分類 -->
            <div class="detail_info mt-5 ml-10 font-weight-bold">
              <p>▼分類</p>
              <span>{{ genera }}</span>
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
  font-size: max(1.4vw, 13px);
  color: #000000 !important;
}
#card_title {
  font-size: max(2.4vw, 14px);
}
.detail_info {
  font-size: max(1.4vw, 13px);
}
</style>
