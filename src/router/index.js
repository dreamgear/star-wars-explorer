import { createRouter, createWebHashHistory } from 'vue-router';
import PeopleView from '../views/PeopleView.js';
import PlanetsView from '../views/PlanetsView.js';
import StarshipsView from '../views/StarshipsView.js';
import FilmsView from '../views/FilmsView.js';
import SpeciesView from '../views/SpeciesView.js';
import VehiclesView from '../views/VehiclesView.js';

const routes = [
    { path: '/', redirect: '/people' },
    { path: '/people', component: PeopleView },
    { path: '/planets', component: PlanetsView },
    { path: '/starships', component: StarshipsView },
    { path: '/films', component: FilmsView },
    { path: '/species', component: SpeciesView },
    { path: '/vehicles', component: VehiclesView },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
