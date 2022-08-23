<template>
  <div class='min-h-screen w-full bg-white max-w-bootstrap mx-auto'>

    <div class='mx-3 bg-white h-[70px]'>
      <div class='flex relative justify-center items-center h-full py-7 px-5'>

        <router-link to='/' class='absolute top-1/2 left-0 -translate-y-1/2'>
          <h1> <img src='/images/logo.png' alt='logo' class='w-[55px]' /></h1>
        </router-link>

        <button class='flex items-center text-gray-500'>
          <i-mdi-compass-outline class='text-[18px]' />
          <span class='text-[13px] ml-2'>Dashboard</span>
        </button>

        <button class='flex items-center text-gray-500 ml-7'>
          <i-ph-chats-circle-bold class='text-[18px]' />
          <span class='text-[13px] ml-2'>Chatting</span>
        </button>

        <button class='flex items-center text-gray-500 ml-7'>
          <i-bx-video-recording class='text-[18px]' />
          <span class='text-[13px] ml-2'>Mettings</span>
        </button>

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
