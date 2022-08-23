<template>
  <div class='w-full h-full overflow-hidden rounded-xl relative'>
    <img class='absolute h-full w-full object-cover z-10' :src='user?.banner' alt='' />

    <div
      ref='videoRef'
      class='absolute h-full w-full object-cover z-20 transition'
      :class='{
        "opacity-0": !media?.video,
        "opacity-100": media?.video
      }'
    />

    <div class='absolute bottom-3 left-3 z-20'>
      <div class='relative px-2 py-0.5 flex items-center overflow-hidden bg-[#0000006e] rounded-lg'>

        <i-ph-user-duotone class='text-white text-[14px]' />

        <h3 class='mb-0 relative z-10 text-white text-[13px] ml-1.5'>

          {{ agoraStore.primaryUser?.id === user.id ? "Bạn" : user.name }}

        </h3>
      </div>
    </div>

    <div v-auto-animate class='absolute top-3 right-3 z-20'>
        <button v-if='isSpeaking' class='bg-primary-600 text-white w-9 h-9 flex items-center justify-center rounded-lg'>
          <i-cil-audio-spectrum />
        </button>

      <button v-else-if='!media?.audio' class='bg-rose-600 text-white w-9 h-9 flex items-center justify-center rounded-lg'>
        <i-ph-microphone-slash-duotone />
      </button>

    </div>

  </div>
</template>

<script lang='ts' setup>
import { UserDocument, UserMedia } from '@entities/user'
import { useRTDB } from '@vueuse/firebase/useRTDB'

const props = defineProps<{
  user: UserDocument
}>()

const agoraStore = useAgoraStore()

const $axios = useAxios()
const getUseDetail = async () => {
  try {
    const result: any = await $axios.get('/smileeye//detailUser/' + props.user?.id)
    if(result) {

      const index = agoraStore.users.findIndex((e) => e.id === props.user.id)

      if(index > -1) {
        agoraStore.users[index]!.name = result.name
        agoraStore.users[index]!.avatar = result.avatar
        agoraStore.users[index]!.email = result.email
        agoraStore.users[index]!.banner = result.banner
      }
    }
  } catch (e) {
      // Todo: Error
  }
}

onMounted(() => nextTick(() => getUseDetail()))

const videoRef = ref<HTMLDivElement>()

watch(() => props.user.videoTrack, (track: any) => {
  nextTick(() => {
    track?.play(videoRef.value!)
  })
})

onMounted(() => nextTick(() => props.user?.videoTrack?.play(videoRef.value!)))

const isSpeaking = computed(() => agoraStore.speakers.findIndex((e) => e.id === props.user.id) > -1)

const route = useRoute()
const media = useRTDB<UserMedia>(dbRef(getDatabase(), `room/${route.params.id}/media/${props.user.id}`))

</script>

<style scoped></style>
