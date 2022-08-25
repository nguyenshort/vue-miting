<template>
  <component :is='component'></component>
</template>

<script lang='ts' setup>
import DesktopView from '@components/room/DesktopView.vue'
import MobileView from '@components/room/MobileView.vue'
import { UserDocument, UserMedia } from '@entities/user'
import { GoalDocument } from '@entities/goal'
import { useRTDB } from '@vueuse/firebase/useRTDB'

const agoraStore = useAgoraStore()
const userStore = useUserStore()

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

onMounted(() => {
  window.addEventListener('beforeunload', async () => {
    if(Object.values(agoraStore.users).length !== 0) {
      await userStore.writeLog(route.params.id as string, 'left')
    }
  });
})


// Gửi notify cho
const axios = useAxios()
const dayjs = useDayjs()
const users = ref<UserDocument[]>([])
const goal = ref<GoalDocument|undefined>()

const getGoal = async () => {
  try {
    const result: GoalDocument = await axios.get(`/smileeye/detail-goal/goal_id=${route.params.id}`)
    if(result) {
      goal.value = result
    }
  } catch (e) {
    //
  }
}

const sendNotify = async () => {
  try {
    users.value = await axios.get(`/smileeye/list-member/goal_root_id=${route.params.id}`)
    if(users.value.length) {
      console.log('==================== Invite users: ', users.value.length, "=================")
      await Promise.all(
        users.value.map((user) => async () => {
          await dbSet(dbRef(getDatabase(), `communication/${user.id}/${route.params.id}`), {
            name: goal.value?.name,
            url: window.location.href,
            invited_at: dayjs().toString(),
            user: userStore.user
          })
        })
      )
    }

  } catch (e) {
      //
  }
}

onMounted(async () => {
  await getGoal()
  if(goal.value) {
    await sendNotify()
  }
})

// Thu lời mời
watch(() => agoraStore.users.length, async (value, oldValue) => {
  console.log(value, oldValue)
  await Promise.all(
    users.value.map((user) => async () => {
      await dbRemove(dbRef(getDatabase(), `communication/${user.id}/${route.params.id}`))
    })
  )
})

const communication = useRTDB<UserMedia>(dbRef(getDatabase(), `communication`))
console.log(communication)

</script>

<style scoped></style>
