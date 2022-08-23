<template>
  <mb-base-modal
    id='mb-chat'
    :visible='roomStore.sidebar === "chat"'
    title='Trò Chuyện'
    @dispose='roomStore.sidebar = undefined'
    @init='scrollToBottom'
  >

    <message-item
      v-for='message in messages'
      :key='message.id'
      :message='message'
      class='mb-5 last:mb-0'
    ></message-item>

    <template #actions>

      <div class='pt-3'>
        <form class='w-full flex items-center px-3 py-2 bg-gray-100 rounded-xl' @submit.prevent='submit'>
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


    </template>

  </mb-base-modal>
</template>

<script lang='ts' setup>
import { useRTDB } from '@vueuse/firebase/useRTDB'
import { MessageDocument } from '@entities/message'
import { v4 as uuidv4 } from 'uuid'

const roomStore = useRoomStore()
const agoraStore = useAgoraStore()

const route = useRoute()
const rawMessage = useRTDB<Record<string, MessageDocument>>(dbRef(getDatabase(), `room/${route.params.id}/chat`))

const messages = computed<MessageDocument[]>(() => {
  return Object.values(rawMessage.value ?? {}).sort((a, b) => a.createdAt - b.createdAt)
})

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

const audio = new Audio('/mp3/message-notification-sfx.mp3');
const count = ref(0)

const scrollToBottom = () => {
  const container = document.querySelector<HTMLDivElement>('#mb-chat .scroll-me')
  if(container) {
    container.scrollTop = container.scrollHeight
  }
}

watch(rawMessage, () => {
  nextTick(() => {
    scrollToBottom()
    if(count.value > 0) {
      audio.play()
    }
    count.value++
  })
})

</script>
