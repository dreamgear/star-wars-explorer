import { defineComponent, ref, onMounted } from 'vue';
import { swapi } from '../services/swapi.js';
import DataTable from '../components/DataTable.js';
import PaginationControl from '../components/PaginationControl.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import SearchBar from '../components/SearchBar.js';
import RelationList from '../components/RelationList.js';

export default defineComponent({
    name: 'FilmsView',
    components: { DataTable, PaginationControl, LoadingSpinner, SearchBar, RelationList },
    setup() {
        const films = ref([]);
        const loading = ref(false);
        const nextUrl = ref(null);
        const prevUrl = ref(null);
        const error = ref(null);
        const page = ref(1);
        const searchQuery = ref('');

        const headers = [
            { key: 'title', label: 'Title' },
            { key: 'episode_id', label: 'Episode' },
            { key: 'director', label: 'Director' },
            { key: 'producer', label: 'Producer' },
            { key: 'release_date', label: 'Release Date' }
        ];

        const loadData = async (url = null, pageNum = 1) => {
            loading.value = true;
            error.value = null;
            try {
                const data = url ? await swapi.getByUrl(url) : await swapi.getFilms(pageNum, searchQuery.value);
                films.value = data.results;
                nextUrl.value = data.next;
                prevUrl.value = data.previous;
                page.value = pageNum;
            } catch (err) {
                error.value = "Failed to load data. Please try again.";
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            loadData();
        });

        const handleNext = () => {
            if (nextUrl.value) loadData(nextUrl.value, page.value + 1);
        };

        const handlePrev = () => {
            if (prevUrl.value) loadData(prevUrl.value, page.value - 1);
        };

        const handleSearch = (query) => {
            searchQuery.value = query;
            page.value = 1;
            loadData(null, 1);
        };

        return {
            films,
            loading,
            headers,
            nextUrl,
            prevUrl,
            handleNext,
            handlePrev,
            handleSearch,
            searchQuery,
            error
        };
    },
    template: `
    <div>
      <h1 class="fade-in">Galactic Cinema</h1>
      <SearchBar v-model="searchQuery" @search="handleSearch" placeholder="Search films..." />
      
      <div v-if="error" style="color: var(--accent); margin-bottom: 1rem;">{{ error }}</div>
      
      <div v-if="loading && films.length === 0">
        <LoadingSpinner />
      </div>
      
      <div v-else>
        <DataTable :headers="headers" :items="films" :loading="loading" expandable>
           <template #expanded="{ item }">
              <RelationList title="Characters" :urls="item.characters" />
              <RelationList title="Planets" :urls="item.planets" />
              <RelationList title="Starships" :urls="item.starships" />
              <RelationList title="Vehicles" :urls="item.vehicles" />
              <RelationList title="Species" :urls="item.species" />
           </template>
        </DataTable>
        <PaginationControl 
          :hasNext="!!nextUrl" 
          :hasPrev="!!prevUrl" 
          :loading="loading"
          @next="handleNext" 
          @prev="handlePrev" 
        />
      </div>
    </div>
  `
});
