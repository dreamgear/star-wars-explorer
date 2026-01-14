const BASE_URL = 'https://swapi.py4e.com/api';

async function fetchResource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
}

export const swapi = {
    getPeople: (page = 1, search = '') => fetchResource(`${BASE_URL}/people/?page=${page}&search=${search}`),
    getPlanets: (page = 1, search = '') => fetchResource(`${BASE_URL}/planets/?page=${page}&search=${search}`),
    getStarships: (page = 1, search = '') => fetchResource(`${BASE_URL}/starships/?page=${page}&search=${search}`),
    getFilms: (page = 1, search = '') => fetchResource(`${BASE_URL}/films/?page=${page}&search=${search}`),
    getSpecies: (page = 1, search = '') => fetchResource(`${BASE_URL}/species/?page=${page}&search=${search}`),
    getVehicles: (page = 1, search = '') => fetchResource(`${BASE_URL}/vehicles/?page=${page}&search=${search}`),
    getByUrl: (url) => fetchResource(url)
};
