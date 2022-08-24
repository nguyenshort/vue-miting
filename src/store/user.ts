import { defineStore } from 'pinia'
import { UserDocument } from '@entities/user'
import { v4 as uuidv4 } from 'uuid'
import { LogDocument } from '@entities/log'

interface IUserStore {
  user?: UserDocument
  _token: string
}

export const useUserStore = defineStore({
  id: 'user',

  state: (): IUserStore => ({
    user: undefined,
    _token: ''
  }),

  getters: {
    auth: (state) => !!state.user
  },

  actions: {
    setUser(payload: any) {
      this.user = payload
    },

    setToken(token: string) {
      this._token = token
    },

    async getMe() {
      const axios = useAxios()
      try {
        this.user = await axios.get('/smileeye/get-user')
      } catch (e) {
        //
      }
    },

    async writeLog(chanel: string, group: 'join' | 'left') {
      await dbSet(dbRef(getDatabase(), `room/${chanel}/logs/${uuidv4()}`),{
        user: {
          id: this.user?.id,
          name: this.user?.name,
          avatar: this.user?.avatar,
        },
        group,
        createdAt: Date.now()
      } as LogDocument)
    },

    logout() {
      this._token = ''
      this.user = undefined
    }
  }
})
