import { createRouter, createWebHistory } from "vue-router";
import PokemonListPage from "../components/pages/PokemonListPage.vue";

const routes = [
  { path: "/", name: "list", component: PokemonListPage },
  { path: "/:pathMatch(.*)*", redirect: "/" }, // routesに定義されていないパスの場合は一覧画面にリダイレクト
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
