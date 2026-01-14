import { defineComponent, ref, onMounted, watch } from 'vue';
import { swapi } from '../services/swapi.js';
import { parseSwapiUrl } from '../utils/urlHelpers.js';

export default defineComponent({
    name: 'RelationList',
    props: {
        title: {
            type: String,
            required: true
        },
        urls: {
            type: Array, // Array of URL strings, or single URL string
            required: false,
            default: () => []
        }
    },
    setup(props) {
        const items = ref([]);
        const loading = ref(false);

        const fetchItems = async () => {
            // Handle single URL (string) or Array of URLs
            const urlList = Array.isArray(props.urls) ? props.urls : (props.urls ? [props.urls] : []);

            if (urlList.length === 0) {
                items.value = [];
                return;
            }

            loading.value = true;
            try {
                // Fetch all items in parallel
                const promises = urlList.map(async (url) => {
                    // Start by constructing the route from the URL itself
                    const parsed = parseSwapiUrl(url);
                    if (!parsed) return null;

                    // Fetch the actual data to get the name/title
                    try {
                        const data = await swapi.getByUrl(url);
                        return {
                            name: data.name || data.title, // People/Planets use name, Films use title
                            route: parsed.path, // e.g., '/people'
                            id: parsed.id
                        };
                    } catch (e) {
                        console.warn('Failed to fetch relation', url);
                        return null;
                    }
                });

                const results = await Promise.all(promises);
                items.value = results.filter(item => item !== null);
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchItems);
        // Refetch if urls prop changes
        watch(() => props.urls, fetchItems);

        return {
            items,
            loading
        };
    },
    template: `
    <div class="relation-group" v-if="items.length > 0 || loading">
        <h4>{{ title }}</h4>
        <div v-if="loading" class="relation-loading">Loading...</div>
        <ul v-else class="relation-list">
            <li v-for="item in items" :key="item.route + item.id">
                <router-link :to="{ path: item.route, query: { search: item.name } }" class="relation-link">
                    {{ item.name }}
                </router-link>
            </li>
        </ul>
    </div>
    `
});
