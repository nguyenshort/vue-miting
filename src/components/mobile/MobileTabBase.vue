<template>
  <div ref="listRef" class="px-4 relative overflow-hidden">
    <h4 class="mt-4 pb-2">
      {{ title }}
    </h4>
    <div class='popup-body my-[15px] overflow-hidden'>
      <div class="overflow-y-auto scrollbar-hide scroll-container" :style='{ height: "calc(90vh - 30px - 70px)"}'>
        <slot />
      </div>
    </div>

    <slot name='after'></slot>

  </div>
</template>

<script lang='ts' setup>
const listRef = ref<HTMLDivElement>()
const { height } = useElementSize(listRef)

defineProps<{
  title: string
}>()

</script>

<style scoped>

</style>
