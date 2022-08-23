<template>
  <div
    id='content'
    ref='el'
    v-auto-animate
    :class='"_" + roomStore.layout'
    class='flex -mx-2.5'
    :data-count='agoraStore.users.length'
  >
      <div
        v-if='roomStore.layout === "sidebar"'
        class='px-2.5 h-full'
        :class='[agoraStore.users.length > 1 ? "w-3/4" : "w-full"]'
      >
        <video-stream v-if='agoraStore.topUser' :user='agoraStore.topUser' />
      </div>

      <div
        v-if='agoraStore.users.length > 1'
        class='px-2.5 flex-shrink-0'
        :class='[roomStore.layout === "sidebar" ? "w-1/4" : "w-full"]'
      >
        <div class='list rounded-xl overflow-hidden h-full'>

          <div class='h-full overflow-auto scrollbar-hide scroll-container'>
            <div
              v-for='(chuck, index) in chuckLayout'
              :key='index'
              class='visual-grid-item'
              :data-count='chuck.length'
            >
              <div
                v-for='(item, index2) in chuck'
                :key='index2'
                class='h-full'
                :style='{
                    height: perSize + "px"
                }'
              >
                <video-stream :user='item' />
              </div>
            </div>
          </div>

        </div>
      </div>

    <div>
      <audio-stream v-for='(item, index) in agoraStore.users' :key='index' :user='item' />
    </div>

  </div>
</template>

<script lang='ts' setup>
const roomStore = useRoomStore()
const agoraStore = useAgoraStore()
const el = ref()

const { height, width } = useElementSize(el)

// Todo: https://vueuse.org/core/usevirtuallist/#component-usage
const perSize = computed(() => {
  // nếu chỉ có 1-2 user => size gốc
  // if(agoraStore.users.length <= 2) {
  //   return height.value
  // }

  // spacing giữa mỗi cái 15
  const primarySize = height.value / (roomStore.layout === 'grid' ? 2 : 3)
  const count = height.value / primarySize

  // Cái cuối không có size
  const totalSPace = (count - 1) * 15

  return (height.value - totalSPace) / (roomStore.layout === 'grid' ? 2 : 3)
})

const chuckLayout = computed(() => {

  const list = []

  let chunkSize = 4
  if (width.value > 800) {
    chunkSize = 4
  } else if (width.value > 650) {
    chunkSize = 3
  } else if (width.value > 500) {
    chunkSize = 2
  } else {
    chunkSize = 1
  }

  let users = roomStore.layout === 'sidebar' ? agoraStore.users.filter((e) => e.id !== agoraStore.topUser?.id) : agoraStore.users
  for (let i = 0; i < users.length; i += chunkSize) {
    list.push(users.slice(i, i + chunkSize))
  }

  return list
})

</script>

<style scoped>
#content._grid .grid-container {
  /*display: grid;*/
  /*grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));*/
  /*grid-gap: 15px;*/
  /*max-height: 100%;*/
  /*overflow-y: auto;*/
  /*height: 100%;*/
}

#content._sidebar .visual-grid-item > div {
  margin-bottom: 15px;
}

#content._sidebar .visual-grid-item:last-child > div:last-child {
  margin-bottom: 0;
}

#content._grid .visual-grid-item {
  display: flex;
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 15px;
}

#content._grid .visual-grid-item > div {
  width: 100%;
  padding: 0 7px;
}

#content._grid .visual-grid-item[data-count="1"] > div, .visual-grid-item[data-count="2"] > div {
  height: calc(100vh - 70px - 60px - 16px - 16px - 50px - 16px - 16px) !important;
}

#content._grid .visual-grid-item[data-count="1"], .visual-grid-item[data-count="2"] {
  margin-bottom: -15px !important;
}
</style>
