import { defineComponent, ref, onMounted } from 'vue';
import { swapi } from '../services/swapi.js';
import DataTable from '../components/DataTable.js';
import PaginationControl from '../components/PaginationControl.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import SearchBar from '../components/SearchBar.js';
import RelationList from '../components/RelationList.js';

export default defineComponent({
    name: 'PeopleView',
    components: { DataTable, PaginationControl, LoadingSpinner, SearchBar, RelationList },
    setup() {
        const people = ref([]);
        const loading = ref(false);
        const nextUrl = ref(null);
        const prevUrl = ref(null);
        const error = ref(null);
        const page = ref(1);
        const searchQuery = ref('');

        const headers = [
            { key: 'name', label: 'Name' },
            { key: 'birth_year', label: 'Birth Year' },
            { key: 'gender', label: 'Gender' },
            { key: 'height', label: 'Height' },
            { key: 'mass', label: 'Mass' }
        ];

        const loadData = async (url = null, pageNum = 1) => {
            loading.value = true;
            error.value = null;
            try {
                const data = url ? await swapi.getByUrl(url) : await swapi.getPeople(pageNum, searchQuery.value);
                people.value = data.results;
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
            people,
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
      <h1 class="fade-in">Galactic Personnel</h1>
      <SearchBar v-model="searchQuery" @search="handleSearch" placeholder="Search people..." />
      
      <div v-if="error" style="color: var(--accent); margin-bottom: 1rem;">{{ error }}</div>
      
      <div v-if="loading && people.length === 0">
        <LoadingSpinner />
      </div>
      
      <div v-else>
        <DataTable :headers="headers" :items="people" :loading="loading" expandable>
           <template #expanded="{ item }">
              <RelationList title="Homeworld" :urls="item.homeworld" />
              <RelationList title="Films" :urls="item.films" />
              <RelationList title="Species" :urls="item.species" />
              <RelationList title="Starships" :urls="item.starships" />
              <RelationList title="Vehicles" :urls="item.vehicles" />
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
