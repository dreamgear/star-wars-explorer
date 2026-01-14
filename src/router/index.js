import { createRouter, createWebHashHistory } from 'vue-router';
import PeopleView from '../views/PeopleView.js';
import PlanetsView from '../views/PlanetsView.js';
import StarshipsView from '../views/StarshipsView.js';

const routes = [
    { path: '/', redirect: '/people' },
    { path: '/people', component: PeopleView },
    { path: '/planets', component: PlanetsView },
    { path: '/starships', component: StarshipsView },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
