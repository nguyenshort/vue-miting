import { ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng'

interface User {
  id: number
  name?: string
  email?: string
  avatar?: string
  banner?: string

  audioTrack?: IMicrophoneAudioTrack | IRemoteAudioTrack
  videoTrack?: ICameraVideoTrack | IRemoteVideoTrack
}

export type UserDocument = User

export interface UserMedia {
  audio: boolean
  video: boolean
}
