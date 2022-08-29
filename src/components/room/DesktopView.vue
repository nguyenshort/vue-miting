<template>
  <div class='min-h-screen w-full bg-white max-w-bootstrap mx-auto'>

    <div class='mx-3 bg-white h-[70px]'>
      <div class='flex relative justify-center items-center h-full py-7 px-5'>

        <a href='/' class='absolute top-1/2 left-0 -translate-y-1/2' @click.prevent='leaveRoom'>
          <h1> <img src='/images/logo.png' alt='logo' class='w-[55px]' /></h1>
        </a>

        <button class='flex items-center text-gray-500'>
          <i-mdi-compass-outline class='text-[18px]' />
          <span class='text-[13px] ml-2'>Dashboard</span>
        </button>

        <button class='flex items-center text-gray-500 ml-7'>
          <i-ph-chats-circle-bold class='text-[18px]' />
          <span class='text-[13px] ml-2'>Chatting</span>
        </button>

        <a-dropdown trigger='click'>

          <button
            class='flex items-center ml-7 relative'
            :class='[ activeInvites.length ? "text-primary-500" : "text-gray-500"]'
          >
            <div
              v-if='activeInvites.length'
              class='w-3.5 h-3.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] absolute -top-2 left-3.5 z-10'
            >
              {{ activeInvites.length }}
            </div>
            <i-bx-video-recording class='text-[18px] relative z-20' />
            <span class='text-[13px] ml-2'>Mettings</span>
          </button>

          <template v-if='invites.length' #overlay>

            <a-menu :key='invites.length'>

              <a-menu-item>

                <div class='flex items-center justify-between'>
                  <div class='mr-3 flex items-center'>
                    <h4 class='mb-0 text-[17px] font-semibold'>Lời Mời</h4>

                    <span>({{ invites.length }})</span>

                  </div>

                  <a-button type='link' class='ml-auto' size='small' @click='deleteAll'>
                    <span class='text-xs'>
                      Xoá
                    </span>
                  </a-button>
                </div>

              </a-menu-item>

              <div class='max-h-[60vh] overflow-y-auto scrollbar-hide'>
                <a-menu-item
                  v-for='invite in invites'
                  :key='invite.id'
                >
                  <invite-item :invite='invite' />
                </a-menu-item>
              </div>
            </a-menu>

          </template>
        </a-dropdown>

        <button class='flex items-center text-gray-500 ml-7'>
          <i-material-symbols-android-contacts-outline class='text-[18px]' />
          <span class='text-[13px] ml-2'>Contact</span>
        </button>

        <div class='absolute top-1/2 right-0 -translate-y-1/2 flex items-center'>

          <button class='flex items-center text-gray-500'>
            <i-akar-icons-settings-horizontal class='text-[18px]' />
            <span class='text-[13px] ml-2'>Settings</span>
          </button>

          <div class='mx-3 w-px h-[25px] bg-gray-200'></div>

          <a-avatar :src='userStore.user?.avatar'></a-avatar>

        </div>

      </div>
    </div>

    <div class='mx-3'>
      <div
        id='meet-content'
        v-auto-animate
        class='flex bg-primary-50 rounded-xl overflow-hidden py-4 px-5 -mx-4'
      >


        <div
          ref='body'
          class='px-4 flex flex-col'
          :class='[roomStore.hasSidebar ? isTablet ? "w-8/12" : "w-9/12" : "w-full"]'
        >

          <div class='flex justify-between items-center flex-shrink-0 h-[50px]'>

            <div>
              <h1 class='text-[20px] mb-0'>{{ $route.params.id }}</h1>
              <h3 class='text-[12px] text-gray-500 mb-0'> {{ $dayjs() }}</h3>
            </div>

            <div>
              <h3 class='text-[12px] text-gray-500 mb-0'>Time Remainning</h3>
              <div class='flex items-center'>
                <i-fluent-record-28-regular class='text-rose-500 text-[18px]' />
                <span class='text-[17px] ml-2'>13:15</span>
              </div>
            </div>

          </div>

          <matrix-layout class='py-4' />
          <navigation-bar class='flex-grow-0'></navigation-bar>

        </div>

        <div
          v-if='roomStore.hasSidebar'
          class='px-4'
          :class='[isTablet ? "w-4/12" : "w-3/12"]'
        >
          <div class='flex flex-col h-full tabs'>
            <participate-tab v-if='roomStore.sidebar === "users"' class='h-full'></participate-tab>
            <chatting-tab v-if='roomStore.sidebar === "chat"' class='h-full'></chatting-tab>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang='ts' setup>
import { useRTDB } from '@vueuse/firebase'
import { InviteDocument } from '@entities/invite'

const roomStore = useRoomStore()
const userStore = useUserStore()

const breakpoints = useBreakpoints({
  table: 1000,
  desktop: 1280,
})

const isTablet = breakpoints.between('table', 'desktop')

const { height } = useWindowSize({ initialHeight: window.innerHeight })

const contentHeight = computed(() => {
  return (height.value - 70 - 60 - 16 - 16 - 50) + 'px'
})

const router = useRouter()
const agoraStore = useAgoraStore()
const route = useRoute()

const leaveRoom = async () => {
  await agoraStore.leave()
  await userStore.writeLog(route.params.id as string, 'left')
  message.success('Thoát phòng thành công')
  await router.push('/')
}

// List meeting
const rawInvites = useRTDB<Record<string, Record<string, InviteDocument>>>(dbRef(getDatabase(), `invites/${userStore.user?.id}`))
const invites = computed<InviteDocument[]>(() => {
  return Object.values(rawInvites.value || {}).flatMap(invites => Object.values(invites)).sort((a, b) => b.createdAt - a.createdAt)
})

const activeInvites = computed<InviteDocument[]>(() => {
  return invites.value.filter(invite => !invite.disabled)
})

const deleteAll = async () => {
  try {
    await dbRemove(dbRef(getDatabase(), `invites/${userStore.user?.id}`))
  } catch (e) {
    //
  }
}
</script>

<style scoped>
#meet-content {
  height: calc(100vh - 70px);
}
.tabs > div + div {
  margin-top: 20px;
}

#content {
  max-height: v-bind(contentHeight);
  height: 100%;
}
</style>
