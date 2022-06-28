import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      projects: [],
    }
  },
})

export default store
