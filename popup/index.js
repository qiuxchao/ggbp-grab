import { createApp, ref, watch } from 'vue'

  createApp({
    setup() {
      const on = ref(true);
      watch(on, (newOn) => {
        chrome.storage.sync.set({ on: newOn });
      })

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