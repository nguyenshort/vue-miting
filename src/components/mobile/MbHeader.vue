<template>
  <div class='flex px-3 h-[50px] items-center'>
    <a href='/' @click.prevent='leaveRoom'>
      <img class='h-[40px] w-auto' src='/images/logo.svg' alt='' />
    </a>

    <div v-if='userStore.auth' class='ml-auto'>
      <current-user-avatar />
    </div>
  </div>
</template>

<script lang='ts' setup>

const router = useRouter()
const agoraStore = useAgoraStore()
const userStore = useUserStore()

const leaveRoom = async () => {
  await agoraStore.leave()
  message.success('Thoát phòng thành công')
  await router.push('/')
}

</script>

<style scoped>

</style>
