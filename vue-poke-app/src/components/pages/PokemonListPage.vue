<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PokemonListCard from "@parts/card/PokemonListCard.vue";
import axios from "axios";
let pokemonList = reactive<Pokemon[]>([]);
const loading = ref(false);

const nextPokemonListUrl = ref<string>("");

onMounted(async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
  nextPokemonListUrl.value = response.data.next;
  const pokemonPromises = response.data.results.map(
    async (pokemon: Pokemon) => {
      const id = (pokemon.url as string).split("/").filter(Boolean).pop();
      // https://pokeapi.co/docs/v2#pokemon-section (Pokemon (endpoint))
      const responseForImage = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      const image =
        responseForImage.data.sprites.other["official-artwork"].front_default;

      // https://pokeapi.co/docs/v2#pokemon-section (Pokemon Species (endpoint))
      const responseForJapaneseName = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );

      const japaneseName = responseForJapaneseName.data.names.find(
        (name: { language: { name: string } }) => name.language.name === "ja"
      ).name;

      return {
        name: japaneseName,
        id,
        image,
      };
    }
  );
  // 全ての非同期処理が完了するまで待つ;
  const resolvedPokemonList = await Promise.all(pokemonPromises);

  // 順番が保たれた状態でpokemonListに追加;
  resolvedPokemonList.forEach((pokemon) => pokemonList.push(pokemon));
});

const fetchPokemonDetails = async () => {
  loading.value = true;
  const response = await axios.get(nextPokemonListUrl.value);
  nextPokemonListUrl.value = response.data.next;
  const pokemonPromises = response.data.results.map(
    async (pokemon: Pokemon) => {
      const id = (pokemon.url as string).split("/").filter(Boolean).pop();
      const responseForImage = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      const image =
        responseForImage.data.sprites.other["official-artwork"].front_default;

      const responseForJapaneseName = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );

      const japaneseName = responseForJapaneseName.data.names.find(
        (name: { language: { name: string } }) => name.language.name === "ja"
      ).name;

      return {
        name: japaneseName,
        id,
        image,
      };
    }
  );
  // 全ての非同期処理が完了するまで待つ;
  const resolvedPokemonList = await Promise.all(pokemonPromises);

  // 順番が保たれた状態でpokemonListに追加;
  resolvedPokemonList.forEach((pokemon) => pokemonList.push(pokemon));
  loading.value = false;
};

type Pokemon = {
  name: string;
  url?: string;
  id?: string;
  image?: string;
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
