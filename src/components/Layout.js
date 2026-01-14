import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Layout',
    template: `
    <div class="container">
      <nav class="glass-panel">
        <h2 style="margin: 0; background: linear-gradient(to right, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Star Wars Explorer
        </h2>
        <div class="nav-links">
          <router-link to="/people" class="nav-link">People</router-link>
          <router-link to="/planets" class="nav-link">Planets</router-link>
          <router-link to="/starships" class="nav-link">Starships</router-link>
        </div>
      </nav>
      
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  `
});
