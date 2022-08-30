<template>
  <van-action-bar class='text-gray-500'>
    <van-action-bar-icon @click="showUsers = true">
      <template #icon>
        <i-icomoon-free-users />
      </template>
    </van-action-bar-icon>
    <van-action-bar-icon @click="showChat = true">
      <template #icon>
        <i-ion-chatbubble-ellipses-outline />
      </template>
    </van-action-bar-icon>
    <van-action-bar-icon @click="onClickIcon">
      <template #icon>
        <i-tabler-layout />
      </template>
    </van-action-bar-icon>

    <van-action-bar-button :type="media?.audio ? 'primary' : 'danger'" @click="toggleTrack('audio')">
      <i-ph-microphone-duotone v-if='media?.audio' />
      <i-ph-microphone-slash-duotone v-else />
    </van-action-bar-button>

    <van-action-bar-button :type="media?.video ? 'primary' : 'danger'" @click="toggleTrack('video')">
      <i-ph-video-camera-duotone v-if='media?.video' />
      <i-ph-video-camera-slash-duotone v-else />
    </van-action-bar-button>

    <van-action-bar-button type="danger" @click="leaveRoom">
      <i-fluent-call-end-28-regular class='text-[20px]' />
    </van-action-bar-button>
  </van-action-bar>

  <van-popup
    v-model:show="showUsers"
    round
    position="bottom"
    closeable
    :style="{ maxHeight: '90vh' }"
  >
    <mobile-tab-base title='Thành Viên'>
      <div
        v-for='user in agoraStore.users'
        :key='user.id'
        class='mb-4 last:mb-0'
      >
        <participate-item :user='user' />
      </div>
    </mobile-tab-base>
  </van-popup>

  <van-popup
    id='mb-chat'
    v-model:show="showChat"
    round
    position="bottom"
    closeable
    :style="{ maxHeight: '90vh' }"
  >
    <mobile-tab-base title='Trò Chuyện'>
      <message-item
        v-for='message in messages'
        :key='message.id'
        :message='message'
        class='mb-5 last:mb-0'
      ></message-item>

      <div class='h-[50px]'></div>

      <template #after>
        <div class="absolute w-full bottom-0 left-0 px-4 py-3 bg-white">
          <van-button round type="success" size="small" block @click='showFormChat = true'>
            Add Message
          </van-button>
        </div>
      </template>

    </mobile-tab-base>

  </van-popup>

  <van-popup
    id='form-chat'
    v-model:show="showFormChat"
    closeable
    round
    position="bottom"
    teleport="body"
  >
    <div class="px-3">
      <h4 class="mt-4 pb-2">Thêm Tin Nhắn Mới</h4>
      <van-field
        v-model="content"
        class="chat-form-input-mb"
        type="textarea"
        placeholder="Nhập tin nhắn"
        rows="6"
        :autosize="true"
      />

      <div class="my-4">
        <van-button round type="primary" size="small" block @click="submit">
          Add Message
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script lang='ts' setup>

import { useRTDB } from '@vueuse/firebase/useRTDB'
import { MessageDocument } from '@entities/message'
import { v4 as uuidv4 } from 'uuid'
import { UserMedia } from '@entities/user'
import { ref as dbRef } from '@firebase/database'
import { getDatabase } from 'firebase/database'
import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng'

const userStore = useUserStore()
const agoraStore = useAgoraStore()

const showUsers = ref(false)
const showChat = ref(false)
const showFormChat = ref(false)

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

    showFormChat.value = false
  } catch (e) {
    //
  }
  loading.value = false

}

const audio = new Audio('/mp3/message-notification-sfx.mp3');
const count = ref(0)

watch(rawMessage, () => {
  nextTick(() => {
    const el = document.querySelector('div#form-chat .scroll-container')
    if(el) {
      el.scrollTop = el.scrollHeight
    }

    if (count.value === 0) {
      count.value++
      audio.play()
    }

  })
})

const media = useRTDB<UserMedia>(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`))

onMounted(async () => {
  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`),{
    audio: !((agoraStore.primaryUser?.audioTrack as ILocalAudioTrack)?.muted),
    video: !((agoraStore.primaryUser?.videoTrack as ILocalVideoTrack)?.muted)
  })
})

const toggleTrack = async (key: 'video' | 'audio') => {
  const data: UserMedia = media.value || {
    audio: false,
    video: false
  }

  data[key] = !data[key]

  await dbSet(dbRef(getDatabase(), `room/${route.params.id}/media/${agoraStore.primaryUser?.id}`),data)
}

watch(media, (value) => {
  //
  (agoraStore.primaryUser?.audioTrack as ILocalAudioTrack)?.setMuted(!value?.audio);
  (agoraStore.primaryUser?.videoTrack as ILocalVideoTrack)?.setMuted(!value?.video)
})

const router = useRouter()
const emitter = useEmitter()
const leaveRoom = async () => {
  await agoraStore.leave()
  await userStore.writeLog(route.params.id as string, 'left')
  emitter.emit('checkDisabled', route.params.id)
  message.success('Thoát phòng thành công')
  await router.push('/')
}
</script>
