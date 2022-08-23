<template>
  <component :is='component'></component>
</template>

<script lang='ts' setup>
import DesktopView from '@components/room/DesktopView.vue'
import MobileView from '@components/room/MobileView.vue'

const agoraStore = useAgoraStore()

const breakpoints = useBreakpoints({
  table: 1000
})

const isMobile = breakpoints.smaller('table')

const component = computed(() => {
  return isMobile.value ? MobileView : DesktopView
})

const router = useRouter()
const route = useRoute()

const checkRouter = () => {
  // Vừa load => ko có user => chuyển về confirm
  if(Object.values(agoraStore.users).length === 0) {
    sessionStorage.setItem('returnChanel', route.params.id as string)
    router.replace({
      name: 'index',
      query: {
        returnChanel: route.params.id
      }
    })
    return
  }
}
checkRouter()


// cookies settings
const cookies = useCookies()
const roomStore = useRoomStore()
const restoreSettings = () => {
  const rawSettings = cookies?.get('settings')
  if(rawSettings) {
    const settings: Record<string, any> = JSON.parse(rawSettings)
    roomStore.display = ['normal', 'mini'].includes(settings.display) ? settings.display : 'normal'
    roomStore.messageSound = settings.messageSound
    roomStore.sidebar = ['users', 'chat', 'settings'].includes(settings.sidebar) ? settings.sidebar : 'users'
    roomStore.layout = ['sidebar', 'grid'].includes(settings.layout) ? settings.layout : 'sidebar'
  }
}
restoreSettings()

// Todo: cookie settings

</script>

<style scoped></style>
