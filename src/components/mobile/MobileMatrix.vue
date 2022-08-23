<template>
  <div id='mobile-matrix'>
    <div
      class='h-full overflow-auto scrollbar-hide scroll-container p-[20px]'
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
  const heightEl = height.value -50 -46 - 20 - 20

  // spacing giữa mỗi cái 15
  const primarySize = heightEl / (agoraStore.users.length < 3 ? agoraStore.users.length : 3)
  const count = heightEl / primarySize

  // Cái cuối không có size
  const totalSPace = (count - 1) * 15

  return (heightEl - totalSPace) / (agoraStore.users.length < 3 ? agoraStore.users.length : 3)
})

</script>

<style scoped>
#mobile-matrix {
  height: calc(100vh - 50px - 46px);
}

#mobile-matrix .visual-grid-item {
  display: flex;
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 15px;
}

#mobile-matrix .visual-grid-item > div {
  width: 100%;
  padding: 0 7px;
}

#mobile-matrix .smaller > .visual-grid-item {
  flex-direction: column;
}

#mobile-matrix .smaller > .visual-grid-item > div {
  height: 100% !important;
}

</style>
