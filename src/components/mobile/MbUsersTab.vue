<template>
  <mb-base-modal :visible='roomStore.sidebar === "users"' title='Thành Viên' @dispose='roomStore.sidebar = undefined'>

    <participate-item
      v-for='(user, index) in agoraStore.users'
      :key='index'
      :user='user'
      class='mb-4 last:mb-0'
    ></participate-item>

  </mb-base-modal>
</template>

<script lang='ts' setup>
const roomStore = useRoomStore()
const agoraStore = useAgoraStore()
</script>
