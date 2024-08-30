<script setup lang="ts"></script>

<template>
  <v-app-bar color="white" height="80">
    <v-app-bar-title
      class="d-flex justify-start align-center ml-8 font-weight-bold"
    >
      <router-link :to="{ name: 'list' }">ポケモン図鑑</router-link>
    </v-app-bar-title>
    <v-btn icon="mdi-magnify" size="x-large"></v-btn>
  </v-app-bar>
  <div class="header_margin"></div>
</template>

<style scoped>
.v-toolbar-title__placeholder > a {
  color: black;
  text-decoration: none;
}

.v-app-bar-title {
  height: 80px;
}
</style>
