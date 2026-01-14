import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PaginationControl',
    props: {
        hasNext: Boolean,
        hasPrev: Boolean,
        loading: Boolean
    },
    emits: ['prev', 'next'],
    template: `
    <div class="pagination">
      <button 
        class="btn btn-outline" 
        :disabled="!hasPrev || loading"
        @click="$emit('prev')"
      >
        <span v-if="loading && hasPrev">...</span>
        <span v-else>&laquo; Previous</span>
      </button>
      
      <span v-if="loading">Loading...</span>
      
      <button 
        class="btn btn-outline" 
        :disabled="!hasNext || loading"
        @click="$emit('next')"
      >
        <span v-if="loading && hasNext">...</span>
        <span v-else>Next &raquo;</span>
      </button>
    </div>
  `
});
