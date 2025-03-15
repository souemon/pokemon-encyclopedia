<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PokemonListCard from "@parts/card/PokemonListCard.vue";
import { fetchListPageItem } from "@/service/index";

let pokemonList = reactive<ProcessedPokemonList>([]);
const loading = ref<boolean>(false);
const nextUrl = ref<string>("");

onMounted(async () => {
  const listPageItem: ListPageItem | undefined = await fetchListPageItem();
  if (!listPageItem) return;
  nextUrl.value = listPageItem.nextUrl;
  listPageItem.processedPokemonList.forEach((pokemon) =>
    pokemonList.push(pokemon)
  );
});

const fetchPokemonDetails = async () => {
  loading.value = true;
  const additionalListPageItem: ListPageItem | undefined =
    await fetchListPageItem(nextUrl.value);
  if (!additionalListPageItem) {
    loading.value = false;
    return;
  }
  nextUrl.value = additionalListPageItem.nextUrl;
  additionalListPageItem.processedPokemonList.forEach((pokemon) =>
    pokemonList.push(pokemon)
  );
  loading.value = false;
};
</script>

<template>
  <v-container>
    <v-row class="mx-auto d-flex justify-start">
      <template v-for="pokemon in pokemonList" :key="pokemon.id">
        <PokemonListCard
          :name="pokemon.name"
          :id="pokemon.id"
          :image="pokemon.image"
        />
      </template>
    </v-row>
    <v-row class="mt-10 mx-auto d-flex justify-center">
      <v-btn
        :disabled="loading"
        :loading="loading"
        class="text-none mb-4"
        color="#E53935"
        size="large"
        variant="elevated"
        @click="fetchPokemonDetails"
      >
        さらに表示
      </v-btn>
    </v-row>
  </v-container>
</template>

<style scoped></style>
