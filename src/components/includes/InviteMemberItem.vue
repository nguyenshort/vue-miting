<template>
  <div class='flex items-center'>

    <a
      href='javascript:void(0)'
      class='block w-[30px] h-[30px] rounded-full overflow-hidden'
    >
      <img :src='member.avatar' alt='' />
    </a>

    <div class='ml-2 mr-3'>
      <h4 class='mb-0'>{{ member.name }}</h4>

      <template
        v-if='["owner", "coach"].includes(member.type)'
      >
        <span v-if='member.type === "owner"' class='text-white bg-orange-500 text-[11px] px-1.5 py-px rounded-lg'>
          {{ member.type }}
        </span>

        <span v-else class='text-white bg-primary-600 text-[11px] px-1.5 py-px rounded-lg'>
          {{ member.type }}
        </span>
      </template>

    </div>

    <a-button type='primary' class='ml-auto' size='small' :disabled='!!skipTime || disabled' @click.stop='inviteMember(member)'>
      Mời
      <span v-if='skipTime' class='text-xs ml-1'>({{ skipTime }})</span>
    </a-button>

  </div>
</template>

<script lang='ts' setup>
import { UserDocument } from '@entities/user'
import { v4 as uuidv4 } from 'uuid'

withDefaults(defineProps<{
  member: UserDocument
  disabled?: boolean
}>(), {
  disabled: false
})

const skipTime = ref(0)

const userStore = useUserStore()
const roomStore = useRoomStore()
const route = useRoute()

const inviteMember = async (member: UserDocument) => {
  skipTime.value = 30
  const timer = setInterval(() => {
    skipTime.value--
    if(skipTime.value === 0) {
      clearInterval(timer)
    }
  }, 1000)

  const uid = uuidv4()
  await dbSet(dbRef(getDatabase(), `invites/${member.id}/${route.params?.id}/${uid}`),{
    id: uid,
    from: {
      id: userStore.user?.id,
      name: userStore.user?.name,
      avatar: userStore.user?.avatar
    },
    to: {
      id: member.id,
      name: member.name
    },
    goal: {
      id: route.params?.id,
      name: roomStore.goal?.name
    },
    disabled: false,
    createdAt: Date.now()
  })
}
</script>

<style scoped>

</style>
