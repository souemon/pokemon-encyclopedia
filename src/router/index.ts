import { createRouter, createWebHistory } from "vue-router";
import PokemonListPage from "@pages/PokemonListPage.vue";
import PokemonDetailPage from "@pages/PokemonDetailPage.vue";

const routes = [
  { path: "/", name: "list", component: PokemonListPage },
  { path: "/detail/:id", name: "detail", component: PokemonDetailPage },
  { path: "/:pathMatch(.*)*", redirect: "/" }, // routesに定義されていないパスの場合は一覧画面にリダイレクト
];

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
