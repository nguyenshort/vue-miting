<template>
  <component :is='component'></component>
</template>

<script lang='ts' setup>
import DesktopView from '@components/room/DesktopView.vue'
import MobileView from '@components/room/MobileView.vue'
import { GoalDocument } from '@entities/goal'
import { InviteDocument } from '@entities/invite'

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

// đánh giấu lời mời
const checkInvite = async () => {
  // đánh giấu tất cả lời mời thuộc phòng hiện tại
  const docRef = await dbGet(dbRef(getDatabase(), `invites/${userStore.user?.id}/${route.params.id}`))
  // kiểm tra user có phải là primary user hay ko bằng cách kiểm tra from của lời mười gâần rất của room
  if (docRef.exists()) {
    // const invites: InviteDocument[] = Object.values<InviteDocument>(docRef.val())
    //   .filter(invite => invite.from.id === userStore.user?.id)
    // const lastInvite = invites.sort((a, b) => b.createdAt - a.createdAt)[0]

    // User hiện tại là primary user
    // if(lastInvite?.from?.id === userStore.user?.id) {
    //   return
    // }
    // Đánh giấu tất cả các lời mời của mn trong phòng
    await checkDisabled()
  }
}

const checkDisabled = async (chanel = '') => {
  await Promise.all(
    roomStore.members.map(async member => {
      const docRef = await dbGet(dbRef(getDatabase(), `invites/${member.id}/${route.params.id || chanel}`))
      if (docRef.exists()) {
        const invites2: InviteDocument[] = Object.values(docRef.val())
        await Promise.all([
          invites2.filter(e => !e.disabled).map(async (invite) => {
            await dbSet(dbRef(getDatabase(), `invites/${member.id}/${route.params.id || chanel}/${invite.id}`), {
              ...invite,
              disabled: true
            } as InviteDocument)
          })
        ])
      }
    })
  )
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
      await checkInvite()
    }
  } catch (e) {
    //
  }
}

const emitter = useEmitter<{
  checkDisabled: string
}>()

onMounted(() => nextTick(async () => {
  window.addEventListener('beforeunload', async (e) => {
    if(Object.values(agoraStore.users).length !== 0) {
      await userStore.writeLog(route.params.id as string, 'left')
     await checkDisabled()
    }
  });
  await checkRoomAsync()
  emitter.on('checkDisabled', async (chanel: string) => checkDisabled(chanel))
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
