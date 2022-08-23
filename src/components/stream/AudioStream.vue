<template>
  <div></div>
</template>

<script lang='ts' setup>
import { UserDocument } from '@entities/user'

const props = defineProps<{
  user: UserDocument
}>()

const agoraStore = useAgoraStore()

onMounted(() => {
  props.user.audioTrack?.play()
})
watch(() => props.user, () => {
  nextTick(() => {

    if(agoraStore.primaryUser.id !== props.user.id) {
      props.user.audioTrack?.play()
    }

  })
})

</script>

<style scoped>

</style>
