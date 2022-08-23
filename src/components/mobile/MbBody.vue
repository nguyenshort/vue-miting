<template>
  <div class='bg-primary-50 p-3'>
    <div
      class='h-full overflow-auto scrollbar-hide scroll-container'
      :class='{
        smaller: agoraStore.users.length < 3
      }'
    >

      <div class='list'>
        <div
          v-for='(item, index2) in agoraStore.users'
          :key='index2'
          class='h-full mb-[15px] last:mb-0'
          :style='{
            height: perSize + "px"
          }'
        >
          <video-stream :user='item' />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang='ts' setup>
const agoraStore = useAgoraStore()

const { height } = useWindowSize({ initialWidth: window.innerWidth, initialHeight: window.innerHeight })

const perSize = computed(() => {
  // nếu chỉ có 1-2 user => size gốc
  // if(agoraStore.users.length <= 2) {
  //   return height.value
  // }
  const heightEl = height.value -50 -50 - 12 - 12

  // spacing giữa mỗi cái 15
  const primarySize = heightEl / (agoraStore.users.length < 3 ? agoraStore.users.length : 3)
  const count = heightEl / primarySize

  // Cái cuối không có size
  const totalSPace = (count - 1) * 15

  return (heightEl - totalSPace) / (agoraStore.users.length < 3 ? agoraStore.users.length : 3)
})
</script>

<style scoped></style>
