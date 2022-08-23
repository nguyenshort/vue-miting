<template>
  <div ref='target' class='bg-white rounded-xl overflow-hidden p-5'>
    <div class='flex items-center border-b border-gray-100 pb-3'>
      <h2 class='text-[19px] text-gray-900 mb-0'>
        {{ title }}
      </h2>

      <span v-if='badge' class='ml-5 px-2 text-white bg-primary-500 text-xs rounded-md'>
        {{ badge }}
      </span>

      <button class='ml-auto'>
        <i-ph-dots-three-outline-fill />
      </button>

    </div>

    <div class='tab-content scrollbar-hide pt-[20px]'>
      <slot :height='height - (40 + 1 + 20)' />
    </div>

  </div>
</template>

<script lang='ts' setup>

import { computed } from 'vue'

defineProps<{
  title: string
  badge: number
}>()

const target = ref<HTMLDivElement>()

const { height } = useElementSize(target)

// 20 padding y => 40
// 12 padding title
// 1 border-bottom
// title heaight ~ 42
const scrollHeight = computed(() => {
  return height.value - (40 + 1) + 'px'
})

</script>

<style scoped>
.tab-content {
  max-height: v-bind(scrollHeight);
  height: 100%;
  overflow-y: auto;
}
</style>
