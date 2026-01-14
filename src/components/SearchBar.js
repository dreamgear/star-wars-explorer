import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'SearchBar',
    props: {
        modelValue: String,
        placeholder: {
            type: String,
            default: 'Search...'
        }
    },
    emits: ['update:modelValue', 'search'],
    setup(props, { emit }) {
        const query = ref(props.modelValue);
        let timeout = null;

        const onInput = (e) => {
            const val = e.target.value;
            query.value = val;
            emit('update:modelValue', val);

            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                emit('search', val);
            }, 500); // 500ms debounce
        };

        return {
            query,
            onInput
        };
    },
    template: `
    <div class="search-bar" style="margin-bottom: 1.5rem;">
      <input 
        type="text" 
        :value="query" 
        @input="onInput"
        :placeholder="placeholder"
        style="
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          background: rgba(15, 23, 42, 0.6);
          color: var(--text-main);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease;
        "
      />
    </div>
  `
});
