import { defineStore } from 'pinia'
import { GoalDocument } from '@entities/goal'
import { UserDocument } from '@entities/user'

interface IRoomStore {
  goal?: GoalDocument
  members: UserDocument[]
  layout: 'sidebar' | 'grid'
  sidebar?: 'users' | 'chat' | 'settings'
  messageSound: boolean
  display: 'normal' | 'mini'
}

export const useRoomStore = defineStore({
  id: 'room',

  state: (): IRoomStore => ({
    goal: undefined,
    members: [],
    layout: 'sidebar',
    sidebar: 'users',
    messageSound: true,
    display: 'normal'
  }),


  getters: {
    hasSidebar: (state) => !!state.sidebar,
    isGoal: (state) => !!state.goal
  },

  actions: {
    toogleTab(tab: 'users' | 'chat' | 'settings') {
      this.sidebar = tab === this.sidebar ? undefined : tab
    },
    async getMembers() {
      const axios = useAxios()
      const route = useRoute()
      try {
        const members = await axios.get(`/smileeye/list-member/goal_root_id=${route.params.id}`)
        console.log(members)
      } catch (e) {
        //
      }
    }
  }
})
