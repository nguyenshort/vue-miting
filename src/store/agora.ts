import { defineStore } from 'pinia'
import { UserDocument } from '@entities/user'
import type { IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalTrack } from 'agora-rtc-sdk-ng'

interface IRoomStore {
  _client?: IAgoraRTCClient
  users: UserDocument[],
  isJoined: boolean
}

// @ts-ignore
export const useAgoraStore = defineStore({
  id: 'agora',

  state: (): IRoomStore => ({
    users: [],
    volumes: [],
    isJoined: false
  }),

  getters: {
    client: (state) => toRaw(state._client),
    speakers: (state) => state.volumes.filter((e) => e.level > 7),
    topUser: (state) => {

      const firstVolume = state.volumes.filter((e) => e.level > 7)[0]
      if(!firstVolume) {
        return state.users[0]
      }

      return state.users.filter((e) => e.id === firstVolume.id)[0]
    },
    primaryUser: (state): UserDocument | undefined => state.users[0] as UserDocument | undefined
  },

  actions: {

    /**
     * @description Init client
     * @param user
     */
    async init(user: UserDocument) {
      if(!this._client) {
        this._client = window.AgoraRTC.createClient({
          codec: 'h264',
          mode: 'rtc'
        })
      }

      const [audio, camera] = await window.AgoraRTC.createMicrophoneAndCameraTracks()

      this.users[0] = {
        ...user,
        audioTrack: audio,
        videoTrack: camera
      }
    },

    registerEvent() {

      const upsertTrack = (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {

        const index = this.users.findIndex((e) => e.id === Number(user.uid))

        if(index > -1) {
          if(mediaType === "audio") {
            this.users[index].audioTrack = user.audioTrack
          } else if (mediaType === "video") {
            this.users[index].videoTrack = user.videoTrack
          }
        } else {
          this.users.push({
            id: Number(user.uid),
            videoTrack: user.videoTrack,
            audioTrack: user.audioTrack
          })
        }
      }

      this.client?.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        console.log(`================================${user.uid} published ${mediaType}`)
        await this.client?.subscribe(user, mediaType)

        upsertTrack(user, mediaType)

      })

      this.client?.on("user-unpublished", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        console.log(`${user.uid} unpublished ${mediaType}`)
        upsertTrack(user, mediaType)
      })

      this.client?.enableAudioVolumeIndicator()
      this.client?.on("volume-indicator", (volumes: any) => {

        this.volumes = volumes.map((volume: any) => ({
          id: Number(volume.uid),
          level: volume.level
        }))

      })

      this.client?.on('user-left',(user: IAgoraRTCRemoteUser) => {
        this.users = this.users.filter((e) => e.id !== Number(user.uid))
      })

    },

    async join(chanel: string) {
      await this.client?.join(import.meta.env.VITE_AGORA_API_KEY, chanel, null, this.users[0].id)

      const _traks = []

      if(this.users[0]?.audioTrack) {
        _traks.push(this.users[0]?.audioTrack)
      }
      if(this.users[0]?.videoTrack) {
        _traks.push(this.users[0]?.videoTrack)
      }

      this.client?.publish(_traks as unknown as ILocalTrack[])
    },

    async leave() {
      await this.client?.leave()
      this.users = []
      this.volumes = []
    }

  }
})
