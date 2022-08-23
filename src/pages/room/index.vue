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

</script>

<style scoped></style>
