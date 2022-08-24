<template>
  <div id='navigation' class='w-full h-[60px] py-2 bg-white rounded-xl flex items-center justify-center relative'>

    <button
      :class='{
        _active: roomStore.sidebar === "users"
      }'
      @click='roomStore.toogleTab("users")'
    >
      <i-icomoon-free-users />
    </button>

    <button
      :class='{
        _active: roomStore.sidebar === "chat"
      }'
      @click='roomStore.toogleTab("chat")'
    >
      <i-ion-chatbubble-ellipses-outline />
    </button>

    <button class='text-primary-500 h-full px-5 bg-primary-50 rounded-lg'>
      <i-ic-outline-screen-share />
    </button>

    <button class='text-primary-500 h-full px-5 bg-primary-50 rounded-lg'>
      <i-bi-mortarboard />
    </button>

    <a-dropdown placement="topLeft" trigger='click'>
      <button class='text-primary-500 h-full px-5 bg-primary-50 rounded-lg'>
        <i-tabler-layout />
      </button>

      <template #overlay>
        <a-menu>
          <a-menu-item @click='roomStore.layout = "sidebar"'>
            <div
              class='flex items-center transition'
              :class='{
                "text-primary-600": roomStore.layout === "sidebar"
              }'
            >
              <i-bi-layout-sidebar-inset-reverse />
              <span class='text-[14px] ml-2'>
                Tiêu Điểm
              </span>
            </div>
          </a-menu-item>
          <a-menu-item @click='agoraStore.users.length > 1 && (roomStore.layout = "grid")'>
            <div
              class='flex items-center transition'
              :class='{
                "text-primary-600": roomStore.layout === "grid"
              }'
            >
              <i-material-symbols-grid-view-rounded />
              <span class='text-[14px] ml-2'>
                Lưới Thu Gọn
              </span>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <button class='text-primary-500 h-full px-5 bg-primary-50 rounded-lg'>
      <i-akar-icons-share-arrow />
    </button>

    <div class='absolute right-3 py-3 h-full'>
      <button class='text-white h-full px-5 bg-rose-600 rounded-lg shadow-md shadow-rose-300' @click='leaveRoom'>
        <i-fluent-call-end-28-regular class='text-[20px]' />
      </button>
    </div>

    <div class='absolute left-3 py-3 h-full'>
      <button
        class='h-full px-4 rounded-lg'
        :class='{
          "text-primary-500 bg-primary-50": media?.audio,
          "bg-rose-600 shadow-md shadow-rose-300 text-white": !media?.audio
        }'
        @click='toggleTrack("audio")'
      >
        <i-ph-microphone-duotone v-if='media?.audio' />
        <i-ph-microphone-slash-duotone v-else />
      </button>

      <button
        class='h-full px-4 rounded-lg ml-3'
        :class='{
          "text-primary-500 bg-primary-50": media?.video,
          "bg-rose-600 shadow-md shadow-rose-300 text-white": !media?.video
        }'
        @click='toggleTrack("video")'
      >
        <i-ph-video-camera-duotone v-if='media?.video' />
        <i-ph-video-camera-slash-duotone v-else />
      </button>

    </div>

  </div>
</template>

<script lang='ts' setup>
import { useRTDB } from '@vueuse/firebase/useRTDB'
import { ref as dbRef } from '@firebase/database'
import { getDatabase } from 'firebase/database'
import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import { UserMedia } from '@entities/user'

const roomStore = useRoomStore()
const agoraStore = useAgoraStore()
const route = useRoute()

const media = useRTDB<UserMedia>(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`))

onMounted(async () => {
  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`),{
    audio: !((agoraStore.primaryUser?.audioTrack as ILocalAudioTrack)?.muted),
    video: !((agoraStore.primaryUser?.videoTrack as ILocalVideoTrack)?.muted)
  })
})

watch(() => agoraStore.users.length, (count) => {
  if(count === 1) {
    roomStore.layout = 'sidebar'
  }
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
const userStore = useUserStore()
const leaveRoom = async () => {
  await agoraStore.leave()
  await userStore.writeLog(route.params.id as string, 'left')
  message.success('Thoát phòng thành công')
  await router.push('/')
}

</script>

<style scoped>
#navigation > button + button {
  margin-left: 15px;
}

#navigation > button {
  @apply text-primary-500 h-full px-5 bg-primary-50 rounded-lg transition text-[15px]
}

#navigation > button._active {
  @apply bg-primary-500 text-white
}
</style>
