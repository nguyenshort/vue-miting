import { defineStore } from 'pinia'

interface IRoomStore {
  layout: 'sidebar' | 'grid'
  sidebar?:  'users' | 'chat' | 'settings'
  messageSound: boolean
  display: 'normal' | 'mini'
}

export const useRoomStore = defineStore({
  id: 'room',

  state: (): IRoomStore => ({
    layout: 'sidebar',
    sidebar: 'users',
    messageSound: true,
    display: 'normal'
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
