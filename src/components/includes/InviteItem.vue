<template>
  <div class='py-2'>

    <div
      class='flex items-center transition'
      :class='[invite.disabled ? "opacity-50" : ""]'
    >
      <a
        href='javascript:void(0)'
        class='block w-[30px] h-[30px] rounded-full overflow-hidden'
      >
        <img :src='invite.from.avatar' alt='' />
      </a>

      <div class='ml-1.5 mr-3'>
        <h4 class='mb-0 font-semibold'>{{ invite.from.name }}</h4>
      </div>

      <span v-if='!invite.disabled' class='ml-auto text-green-500'>
        <i-radix-icons-dot-filled />
      </span>
    </div>

    <div class='mt-1 text-gray-500 text-[14px]'>
      Đã mời bạn tham gia
      <span>{{ invite.to.name }}</span>
    </div>

    <div>
      <span class='text-xs text-gray-400'>{{ $dayjs(invite.createdAt).fromNow() }}</span>
    </div>

  </div>
</template>

<script lang='ts' setup>
import { InviteDocument } from '@entities/invite'

defineProps<{
  invite: InviteDocument
}>()
</script>

<style scoped>

</style>
