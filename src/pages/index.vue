<template>
  <div
    class='h-screen bg-gradient-to-br from-white to-primary-50 bg-no-repeat bg-cover'
    style='background-image: url("/svg/bg.svg");'
  >

    <div class='h-screen flex items-center justify-center md:justify-end relative'>

      <div class='absolute top-5 right-5'>
        <current-user-avatar v-if='userStore.auth' />
        <a-button v-else type='danger' @click='$emitter.emit("authModal")'>Đăng Nhập</a-button>

      </div>

      <img src='/svg/metting.svg' class='hidden md:inline h-[90vh] relative -top-10' alt='' />

      <div class='md:absolute md:top-1/2 md:left-28 md:-translate-y-1/2'>

        <div class='max-w-[450px] relative -top-10 mx-10 md:mx-0'>
          <div class='text-white text-center md:text-left'>
            <div class='text-[76px] font-semibold leading-none'>Video Call</div>
            <div class='text-[76px] leading-none'>Experience</div>

            <p class='text-sm mt-3 font-light'>Lorem ipsum dolor sit amet. Aliquam beatae consequuntur delectus earum explicabo quia recusandae sapiente temporibus?</p>

            <div class='mt-7 flex'>
              <a-button type="danger" size='large' @click='authFunction(newRoom)'>
                <template #icon>
                  <i-bx-bxs-video-recording class='inline mr-2' />
                </template>
                Cuộc Họp Mới
              </a-button>

              <div class='w-10'></div>

              <a-input
                v-model:value='roomID'
                placeholder='Hoặc nhập ID phòng'
                @keyup.enter='authFunction(toRoom(roomID.toString()))'
              >
                <template #prefix>
                  <i-material-symbols-video-chat-rounded />
                </template>
              </a-input>

            </div>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>
<script lang='ts' setup>
import { v4 as uuidv4 } from 'uuid'

const userStore = useUserStore()
const emitter = useEmitter()

const autoRoom = ref('')
const roomID = ref('')

const toRoom = (id: string) => {
  if(!id) {
    return
  }
  emitter.emit('confirmModal', id)
}

const authFunction = (cb: () => void | Promise<void>) => {
  if(userStore.auth) {
    cb?.()
  } else {
    emitter.emit('authModal')
  }
}

const newRoom = () => {
  toRoom(uuidv4().replace(/-/g, '').substring(0, 6))
}

const route = useRoute()
onMounted(() => nextTick(() => {
  if(route.query.returnChanel) {
    autoRoom.value = route.query.returnChanel as string
    window.history.replaceState({}, '', '/')
    authFunction(() => {
      toRoom(roomID.value || autoRoom.value)
    })
  }
}))

watch(() => userStore.auth, (auth) => {
  if(auth) {
    console.log("watch to room")
    toRoom(roomID.value || autoRoom.value)
  }
})

</script>
