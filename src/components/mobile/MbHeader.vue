<template>
  <div class='flex px-3 h-[50px]'>
    <a href='/' @click.prevent='leaveRoom'>
      <img class='h-[45px] w-auto' src='/images/logo.png' alt='' />
    </a>

    <button class='text-[16px] ml-auto'>
      <i-akar-icons-settings-horizontal />
    </button>

  </div>
</template>

<script lang='ts' setup>

const router = useRouter()
const agoraStore = useAgoraStore()

const leaveRoom = async () => {
  await agoraStore.leave()
  message.success('Thoát phòng thành công')
  await router.push('/')
}

</script>

<style scoped>

</style>
