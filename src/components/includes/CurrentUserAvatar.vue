<template>
  <a-dropdown placement="bottomRight" trigger='click'>
    <a-avatar :src='userStore.user?.avatar'></a-avatar>

    <template #overlay>
      <a-menu>
        <a-menu-item @click='leaveRoom'>
          <div class='flex items-center transition'>
            <i-uim-signout />
            <span class='text-[14px] ml-2'>
                Đăng Xuất
              </span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>

  </a-dropdown>
</template>

<script lang='ts' setup>

const router = useRouter()
const route = useRoute()
const agoraStore = useAgoraStore()
const userStore = useUserStore()

const emitter = useEmitter()
const leaveRoom = async () => {
  await agoraStore.leave()
  await userStore.writeLog(route.params.id as string, 'left')
  emitter.emit('checkDisabled', route.params.id)
  userStore.logout()
  await router.push('/')
}

</script>

<style scoped>

</style>
