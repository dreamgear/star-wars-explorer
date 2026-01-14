import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'DataTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    loading: Boolean,
    expandable: Boolean
  },
  setup(props) {
    const sortKey = ref(null);
    const sortOrder = ref('asc'); // 'asc' or 'desc'
    const expandedIndex = ref(-1);

    const toggleExpand = (index) => {
      if (expandedIndex.value === index) {
        expandedIndex.value = -1;
      } else {
        expandedIndex.value = index;
      }
    };

    const sortedItems = computed(() => {
      if (!sortKey.value) return props.items;

      return [...props.items].sort((a, b) => {
        const valA = a[sortKey.value];
        const valB = b[sortKey.value];

        // Handle numbers
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder.value === 'asc' ? numA - numB : numB - numA;
        }

        // Handle strings
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortOrder.value === 'asc' ? -1 : 1;
        if (strA > strB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    });

    const toggleSort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
      }
    };

    return {
      sortKey,
      sortOrder,
      sortedItems,
      toggleSort,
      toggleExpand,
      expandedIndex
    };
  },
  template: `
    <div class="glass-panel" style="padding: 0; overflow: hidden;">
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th v-if="expandable" style="width: 50px;"></th>
              <th 
                v-for="header in headers" 
                :key="header.key"
                @click="toggleSort(header.key)"
                style="cursor: pointer; user-select: none;"
                :title="'Sort by ' + header.label"
              >
                {{ header.label }}
                <span v-if="sortKey === header.key">
                  {{ sortOrder === 'asc' ? '▲' : '▼' }}
                </span>
                <span v-else style="opacity: 0.3">⇅</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sortedItems.length === 0 && !loading">
              <td :colspan="headers.length" style="text-align: center; color: var(--text-muted);">
                No data available.
              </td>
            </tr>
            <template v-for="(item, index) in sortedItems" :key="index">
              <tr class="fade-in" :style="{ animationDelay: index * 50 + 'ms' }">
                <td v-if="expandable" class="text-center">
                  <span class="toggle-icon" @click="toggleExpand(index)">
                    🔍
                  </span>
                </td>
                <td v-for="header in headers" :key="header.key">
                  {{ item[header.key] }}
                </td>
              </tr>
              <tr v-if="expandedIndex === index" class="expanded-row">
                 <td :colspan="headers.length + (expandable ? 1 : 0)" style="padding: 0;">
                    <div class="expanded-row-content">
                       <slot name="expanded" :item="item"></slot>
                    </div>
                 </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  `
});
