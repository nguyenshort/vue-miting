<template>
  <div class='flex items-center'>

    <div class='rounded-lg w-[40px] h-[40px] rounded-lg overflow-hidden bg-gray-100'>
      <img :src='user.avatar' alt='' />
    </div>

    <h1 class='ml-3 font-medium text-gray-500'>
      {{ agoraStore.primaryUser?.id === user.id ? "Bạn" : user.name }}
    </h1>

    <div class='ml-auto border-l border-gray-100 pl-2 text-[17px]'>

      <button
        :class='{
          "text-primary-600": media?.audio,
          "text-rose-500": !media?.audio
        }'
        @click='toggleTrack("audio")'
      >
        <i-ph-microphone-duotone v-if='media?.audio' />
        <i-ph-microphone-slash-duotone v-else />
      </button>

      <button
        class='ml-3'
        :class='{
          "text-primary-600": media?.video,
          "text-rose-500": !media?.video
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
import { UserDocument, UserMedia } from '@entities/user'
import { useRTDB } from '@vueuse/firebase/useRTDB'

const agoraStore = useAgoraStore()
const props = defineProps<{
  user: UserDocument
}>()

const route = useRoute()
const media = useRTDB<UserMedia>(dbRef(getDatabase(), `room/${route.params.id}/media/${props.user.id}`))

const toggleTrack = async (key: 'video' | 'audio') => {
  const data: UserMedia = media.value || {
    audio: false,
    video: false
  }

  data[key] = !data[key]

  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${props.user.id}`),data)
}
</script>

