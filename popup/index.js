import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const on = ref(true);
      return {
        on
      }
    },

    mounted() {
      chrome.storage.sync.get(['on'], result => {
        this.on = result.on || false;
      });
    }

  }).mount('#app')