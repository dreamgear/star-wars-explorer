import { defineComponent } from 'vue';
import Layout from './components/Layout.js';

export default defineComponent({
    name: 'App',
    components: {
        Layout
    },
    template: `
    <Layout />
  `
});
