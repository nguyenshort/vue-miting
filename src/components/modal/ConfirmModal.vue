<template>
  <modal-base ref='modalRef' :title='`Xác nhận vào phòng`' :max-width='700' event='confirmModal' @init='init'>

    <div class='md:flex -mx-3'>
      <div class='md:w-2/3 px-3'>

        <div
          ref='videoRef'
          class='w-full bg-primary-100 rounded-lg overflow-hidden h-[250px] overflow-hidden'
        ></div>

      </div>
      <div class='md:w-1/3 px-3 flex flex-col mt-5 md:mt-0'>

        <div class='font-semibold'>Tuỳ Chọn Tham Gia</div>

        <div class='h-px w-full bg-primary-100 my-4'></div>

        <div class='flex items-center justify-center'>
          <a-button type='primary' :loading='loading' @click='join'>
            Tham Gia
          </a-button>

          <div class='w-4'></div>

          <a-button type='danger'>
            Huỷ Bỏ
          </a-button>
        </div>

        <div class='text-xs text-gray-400 mt-auto hidden md:flex'>
          <i-material-symbols-check-box-outline class='text-green-500 mr-2' />
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </div>

      </div>
    </div>

  </modal-base>
</template>

<script lang='ts' setup>
import { UserDocument } from '@entities/user'

const router = useRouter()
const agoraStore = useAgoraStore()
const userStore = useUserStore()

const modalRef = ref()
const videoRef = ref<HTMLDivElement>()


const chanel = ref('')
const init = async (_chanel: string) => {

  if(!_chanel) {
    modalRef.value?.dispose()
    return
  }
  chanel.value = _chanel

  if(!userStore.user) {
    return
  }
  await agoraStore.init(userStore.user as UserDocument)
  agoraStore.users[0].videoTrack?.play(videoRef.value!)

}

const loading = ref(false)
const join = async () => {

  if(!userStore.user) {
    return
  }

  loading.value = true

  agoraStore.registerEvent()

  setTimeout(async () => {
    await agoraStore.join(chanel.value)
    modalRef.value?.dispose()
    loading.value = false

    await userStore.writeLog(chanel.value, 'join')

    await router.push('/room/' + chanel.value)
  }, 300)
}

</script>

<style scoped>

</style>
