import { defineStore } from 'pinia'

interface IRoomStore {
  layout: 'sidebar' | 'grid'
  sidebar?:  'users' | 'chat' | 'settings'
}

export const useRoomStore = defineStore({
  id: 'room',

  state: (): IRoomStore => ({
    layout: 'sidebar',
    sidebar: 'users'
  }),


  getters: {
    hasSidebar: (state) => !!state.sidebar
  },

  actions: {
    toogleTab(tab: 'users' | 'chat' | 'settings') {
      this.sidebar = tab === this.sidebar ? undefined : tab
    }
  }
})
