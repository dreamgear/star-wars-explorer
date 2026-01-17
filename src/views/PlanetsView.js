import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { swapi } from '../services/swapi.js';
import DataTable from '../components/DataTable.js';
import PaginationControl from '../components/PaginationControl.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import SearchBar from '../components/SearchBar.js';
import RelationList from '../components/RelationList.js';

export default defineComponent({
    name: 'PlanetsView',
    components: { DataTable, PaginationControl, LoadingSpinner, SearchBar, RelationList },
    setup() {
        const route = useRoute();
        const planets = ref([]);
        const loading = ref(false);
        const nextUrl = ref(null);
        const prevUrl = ref(null);
        const error = ref(null);
        const page = ref(1);
        const searchQuery = ref(route.query.search || '');

        const autoExpand = computed(() => route.query.autoExpand === 'true');

        const headers = [
            { key: 'name', label: 'Name' },
            { key: 'climate', label: 'Climate' },
            { key: 'terrain', label: 'Terrain' },
            { key: 'population', label: 'Population' },
            { key: 'gravity', label: 'Gravity' }
        ];

        const loadData = async (url = null, pageNum = 1) => {
            loading.value = true;
            error.value = null;
            try {
                const data = url ? await swapi.getByUrl(url) : await swapi.getPlanets(pageNum, searchQuery.value);
                planets.value = data.results;
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

        watch(() => route.query, (newQuery) => {
            if (newQuery.search !== undefined && newQuery.search !== searchQuery.value) {
                searchQuery.value = newQuery.search || '';
                page.value = 1;
                loadData(null, 1);
            }
        });

        return {
            planets,
            loading,
            headers,
            nextUrl,
            prevUrl,
            handleNext,
            handlePrev,
            handleSearch,
            handleSearch,
            searchQuery,
            error,
            autoExpand
        };
    },
    template: `
    <div>
      <h1 class="fade-in">Known Systems</h1>
      <SearchBar v-model="searchQuery" @search="handleSearch" placeholder="Search planets..." />

       <div v-if="error" style="color: var(--accent); margin-bottom: 1rem;">{{ error }}</div>
      
      <div v-if="loading && planets.length === 0">
        <LoadingSpinner />
      </div>
      
      <div v-else>
        <DataTable :headers="headers" :items="planets" :loading="loading" expandable :autoExpand="autoExpand">
           <template #expanded="{ item }">
              <RelationList title="Residents" :urls="item.residents" />
              <RelationList title="Films" :urls="item.films" />
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
