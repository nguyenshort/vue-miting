<template>
  <div>
    <mb-header />
    <mb-body id='mb-body' />
    <mb-bottom />
  </div>
</template>

<script lang='ts' setup>
const roomStore = useRoomStore()

roomStore.sidebar = undefined
</script>

<style scoped>
#mb-body {
  height: calc(100vh - 50px - 50px);
  overflow: hidden;
}
</style>
