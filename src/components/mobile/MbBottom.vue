<template>
  <div id='bottomBar' class='h-[50px] flex items-center px-3 py-2'>

    <button
      :class='[roomStore.sidebar === "users" ? "text-primary-500" : ""]'
      @click='roomStore.toogleTab("users")'
    >
      <i-uil-users-alt />
    </button>

    <button
      :class='[roomStore.sidebar === "chat" ? "text-primary-500" : ""]'
      class='ml-3'
      @click='roomStore.toogleTab("chat")'
    >
      <i-majesticons-chat-text-line />
    </button>

    <button
      :class='[roomStore.sidebar === "settings" ? "text-primary-500" : ""]'
      class='ml-3'
      @click='roomStore.toogleTab("settings")'
    >
      <i-tabler-layout />
    </button>


    <button
      class='text-primary-500 ml-auto !px-3 rounded-full bg-primary-100'
      @click='toggleTrack("audio")'
    >
      <i-ph-microphone-duotone v-if='media?.audio' />
      <i-ph-microphone-slash-duotone v-else />
    </button>

    <button
      class='text-primary-500 ml-4 !px-3 rounded-full bg-primary-100'
      @click='toggleTrack("video")'
    >
      <i-ph-video-camera-duotone v-if='media?.video' />
      <i-ph-video-camera-slash-duotone v-else />
    </button>

    <button
      class='text-white ml-4 bg-rose-500 !px-5 rounded-full shadow-rose-300 shadow'
      @click='leaveRoom'
    >
      <i-fluent-call-end-28-regular />
    </button>

  </div>
  <mb-users-tab />
  <mb-chat-tab />
</template>

<script lang='ts' setup>
import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import { UserMedia } from '@entities/user'
import { useRTDB } from '@vueuse/firebase/useRTDB'

const agoraStore = useAgoraStore()
const roomStore = useRoomStore()
const route = useRoute()

const media = useRTDB<UserMedia>(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`))

onMounted(async () => {
  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`),{
    audio: !((agoraStore.primaryUser?.audioTrack as ILocalAudioTrack)?.muted),
    video: !((agoraStore.primaryUser?.videoTrack as ILocalVideoTrack)?.muted)
  })
})

const toggleTrack = async (key: 'video' | 'audio') => {
  const data: UserMedia = media.value || {
    audio: false,
    video: false
  }

  data[key] = !data[key]

  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`),data)
}

watch(media, (value) => {
  //
  (agoraStore.primaryUser?.audioTrack as ILocalAudioTrack)?.setMuted(!value?.audio);
  (agoraStore.primaryUser?.videoTrack as ILocalVideoTrack)?.setMuted(!value?.video)
})

const router = useRouter()
const leaveRoom = async () => {
  await agoraStore.leave()
  message.success('Thoát phòng thành công')
  await router.push('/')
}
</script>

<style scoped>
#bottomBar > button {
  @apply text-[19px] transition px-3 h-full
}
</style>
