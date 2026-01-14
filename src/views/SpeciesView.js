import { defineComponent, ref, onMounted } from 'vue';
import { swapi } from '../services/swapi.js';
import DataTable from '../components/DataTable.js';
import PaginationControl from '../components/PaginationControl.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import SearchBar from '../components/SearchBar.js';

export default defineComponent({
    name: 'SpeciesView',
    components: { DataTable, PaginationControl, LoadingSpinner, SearchBar },
    setup() {
        const species = ref([]);
        const loading = ref(false);
        const nextUrl = ref(null);
        const prevUrl = ref(null);
        const error = ref(null);
        const page = ref(1);
        const searchQuery = ref('');

        const headers = [
            { key: 'name', label: 'Name' },
            { key: 'classification', label: 'Classification' },
            { key: 'designation', label: 'Designation' },
            { key: 'language', label: 'Language' },
            { key: 'average_height', label: 'Height' }
        ];

        const loadData = async (url = null, pageNum = 1) => {
            loading.value = true;
            error.value = null;
            try {
                const data = url ? await swapi.getByUrl(url) : await swapi.getSpecies(pageNum, searchQuery.value);
                species.value = data.results;
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
            species,
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
      <h1 class="fade-in">Galactic Species</h1>
      <SearchBar v-model="searchQuery" @search="handleSearch" placeholder="Search species..." />
      
      <div v-if="error" style="color: var(--accent); margin-bottom: 1rem;">{{ error }}</div>
      
      <div v-if="loading && species.length === 0">
        <LoadingSpinner />
      </div>
      
      <div v-else>
        <DataTable :headers="headers" :items="species" :loading="loading" />
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
