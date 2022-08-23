<template>
  <modal-base ref="modal" event="authModal" :max-width="450" title="Sign In">
    <template #default='{ show }'>

      <div style='width: 250px; height: 200px' class='mx-auto'>

        <vue-lottie-player v-if='show' width='250px' height='200px' loop path="https://assets3.lottiefiles.com/packages/lf20_DnLK6k.json" />

      </div>

      <div class="text-center">
        <small class="text-xs italic opacity-90 text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </small>
      </div>
      <form id="authForm" class="max-w-xs mx-auto mt-4">

        <a-form
          :model="form"
          name="basic"
          autocomplete="off"
          @finish='login'
        >
          <a-form-item
            name="email"
            :rules="[{ required: true, message: 'Please input your email!' }]"
          >
            <a-input v-model:value="form.email" placeholder='Email ID' />
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
          >
            <a-input-password v-model:value="form.password"  placeholder='*********'/>
          </a-form-item>

          <div class='flex justify-center'>
            <a-form-item>
              <a-button type="primary" html-type="submit" shape="round">Đăng Nhập</a-button>
            </a-form-item>
          </div>
        </a-form>


        <div>
          <div class="flex items-center mt-5">
            <span class="w-full h-px bg-gray-200" />
            <span class="flex-shrink-0 text-xs font-medium text-gray-400 mx-3">HOẶC TIẾP TỤC VỚI</span>
            <span class="w-full h-px bg-gray-200" />
          </div>
          <div class="flex items-center justify-center mt-5">
            <button class="scale-95 transform mx-3">
              <img width="25" height="25" src="/images/logo/gg.png" alt="">
            </button>
            <button class="mx-3 transform -translate-y-0.5">
              <img src="/images/logo/apple.png" alt="" class="h-[25px] w-auto object-cover">
            </button>
          </div>
        </div>
      </form>
      <div class="text-xs text-center mt-8 text-gray-400">
        <span class="mr-1">© 2021 Comix</span>
        <i>|</i>
        <span class="mx-1">Terms of Service</span>
        <i>|</i>
        <span class="ml-1">Privacy Policy</span>
      </div>
    </template>
  </modal-base>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { LoginInput } from '@dto/auth-input.dto'

const modal = ref<any>(null)


// Form data
const form = reactive<LoginInput>({
  email: 'dnstylish@gmail.com',
  password: 'Khoi@025'
})

// active button
// Support login action
const $axios = useAxios()
const cookies = useCookies()
const useUser = useUserStore()

// Thông báo

/**
 * Lưu token vào cookie
 * Gi token vào store vad redirect đến trang chủ
 */
const login = async () => {
  try {
    const { data } = await $axios.post('/smileeye/ppe-core/auth/login', toRaw(form))
    cookies?.set('_token', data.token)
    useUser.setToken(data.token)
    useUser.setUser(data)
    message.success('Đăng nhập thành công')
    modal.value?.dispose()
  } catch (e) {
    message.error('Kiểm tra thông tin của bạn')
  }
}

</script>
