<template>
  <tab-base title='Chatting' :badge='messages.length'>
    <template #default='{ height }'>

      <div :style='{ height: height + "px" }' class='scrollbar-hide overflow-y-hidden relative'>

        <div
          ref='listRef'
          :style='{ height: height - 60 + "px" }'
          class='overflow-y-auto scrollbar-hide'
        >

          <message-item
            v-for='message in messages'
            :key='message.id'
            :message='message'
            class='mb-5 last:mb-0'
          ></message-item>

        </div>

        <div class='absolute bottom-0 left-0 right-0 bg-gray-100 rounded-lg'>

          <form class='w-full flex items-center px-3 py-2' @submit.prevent='submit'>
            <button class='text-gray-500 flex-shrink-0'>
              <i-uil-comment-image />
            </button>

            <input
              v-model='content'
              type='text'
              placeholder='Type something...'
              class='w-full px-2 ml-2 border-l focus:outline-0 bg-transparent text-sx'
            />

          </form>

        </div>

      </div>

    </template>
  </tab-base>
</template>

<script lang='ts' setup>
import { useRTDB } from '@vueuse/firebase/useRTDB'
import { MessageDocument } from '@entities/message'
import {v4 as uuidv4} from "uuid"
import MessageItem from '@components/Tabs/MessageItem.vue'

const route = useRoute()
const rawMessage = useRTDB<Record<string, MessageDocument>>(dbRef(getDatabase(), `room/${route.params.id}/chat`))

const messages = computed<MessageDocument[]>(() => {
  return Object.values(rawMessage.value ?? {}).sort((a, b) => a.createdAt - b.createdAt)
})

const agoraStore = useAgoraStore()
const content = ref('')
const loading = ref(false)

const submit = async () => {
  if (!content.value || loading.value) {
    return
  }

  loading.value = true
  try {

    const id = uuidv4()
    await dbSet(dbRef(getDatabase(), `room/${route.params.id}/chat/` + id), {
      id,
      user: {
        id: agoraStore.primaryUser?.id,
        name: agoraStore.primaryUser?.name,
        avatar: agoraStore.primaryUser?.avatar,
      },
      content: content.value,
      createdAt: Date.now()
    } as MessageDocument)

    content.value = ''
  } catch (e) {
     //
  }
  loading.value = false

}

const listRef = ref<HTMLDivElement>()
const audio = new Audio('/mp3/message-notification-sfx.mp3');
const count = ref(0)

const roomStore = useRoomStore()
watch(rawMessage, () => {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight

      if(roomStore.messageSound) {
        if(count.value > 0) {
          audio.play()
        }
        count.value++
      }

    }
  })
})

</script>

<style scoped></style>
