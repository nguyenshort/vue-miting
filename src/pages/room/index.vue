<template>
  <component :is='component'></component>
</template>

<script lang='ts' setup>
import DesktopView from '@components/room/DesktopView.vue'
import MobileView from '@components/room/MobileView.vue'
import { GoalDocument } from '@entities/goal'

const agoraStore = useAgoraStore()
const userStore = useUserStore()

const breakpoints = useBreakpoints({
  table: 1000
})
const isMobile = breakpoints.smaller('table')

const component = computed(() => {
  return isMobile.value ? MobileView : DesktopView
})

const route = useRoute()

const axios = useAxios()
const roomStore = useRoomStore()


const getMembers = async () => {
  try {
    roomStore.members = await axios.get(`/smileeye/list-member/goal_root_id=${route.params.id}`)
  } catch (e) {
    //
  }
}

/**
 * Kiểm tra xem phòng có phải âf phòng học hay ko...
 */
const checkRoomAsync = async () => {
  try {
    const result: GoalDocument = await axios.get(`/smileeye/detail-goal/goal_id=${route.params.id}`)
    if(result) {
      roomStore.goal = result
      await getMembers()
    }
  } catch (e) {
    //
  }
}

onMounted(() => nextTick(async () => {
  window.addEventListener('beforeunload', async () => {
    if(Object.values(agoraStore.users).length !== 0) {
      await userStore.writeLog(route.params.id as string, 'left')
    }
  });
  await checkRoomAsync()
}))

// await checkRoomAsync()
//
// const sendNotify = async () => {
//   try {
//     users.value = await axios.get(`/smileeye/list-member/goal_root_id=${route.params.id}`)
//     if(users.value.length) {
//       console.log('==================== Invite users: ', users.value.length, "=================")
//       await Promise.all(
//         users.value.map((user) => async () => {
//           await dbSet(dbRef(getDatabase(), `communication/${user.id}/${route.params.id}`), {
//             name: goal.value?.name,
//             url: window.location.href,
//             invited_at: dayjs().toString(),
//             user: userStore.user
//           })
//         })
//       )
//     }
//
//   } catch (e) {
//       //
//   }
// }


// Kiểm tra xem có phải là phòng học hay ko...
// onMounted(async () => {
//   await checkRoomAsync()
// })

// Thu lời mời
// watch(() => agoraStore.users.length, async (value, oldValue) => {
//   console.log(value, oldValue)
//   await Promise.all(
//     users.value.map((user) => async () => {
//       await dbRemove(dbRef(getDatabase(), `communication/${user.id}/${route.params.id}`))
//     })
//   )
// })

</script>

<style scoped></style>
