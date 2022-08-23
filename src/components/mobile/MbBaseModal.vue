<template>
  <teleport to='body'>
    <div
      :id='$attrs.id'
      class='fixed top-0 left-0 right-0 bottom-0 z-[10000] flex items-end transition'
      :class='[visible ?"visible" : "invisible opacity-0"]'
    >
      <a
        v-if='visible'
        href='javascript:void(0)'
        class='absolute top-0 left-0 right-0 bottom-0 bg-black opacity-[0.2] z-10 transition delay-75'
        :class='[visible ? "opacity-[0.2]" : "opacity-[0]"]'
        @click='dispose'
      ></a>

      <div
        ref='bodyRef'
        class='mb-modal-body bg-white w-full relative z-[20] rounded-tr-xl rounded-tl-xl transform transition duration-300'
        :class='{
        _active: visible,
      }'
      >

        <div
          class='h-[7px] w-[50px] bg-gray-300 mx-auto mt-2 rounded-full'
          @click='dispose'
        ></div>

        <div class='px-4 flex justify-between items-start'>
          <h4 class='text-[19px] font-bold mb-0'>
            {{ title }}
          </h4>

          <button
            class='text-[18px] text-gray-400'
            @click='dispose'
          >
            <i-carbon-close-filled />
          </button>

        </div>

        <div
          class='px-4 h-full rounded-xl overflow-hidden mt-2 flex flex-col'
          :style='{
            maxHeight: maxHeight
          }'
        >
          <div
            class='overflow-y-auto scrollbar-hide h-full scroll-me'
          >
            <slot></slot>
          </div>

          <slot name='actions'></slot>

          <div class='h-3 flex-shrink-0'></div>

        </div>

      </div>

    </div>
  </teleport>
</template>

<script lang='ts' setup>

const props = withDefaults(defineProps<{
  title: string
  visible: boolean
  maxHeight?: string
}>(), {
  maxHeight: '80vh'
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'dispose'): void
  (e: 'init'): void
}>()

const bodyRef = ref<HTMLElement>()

const dispose = () => {
  bodyRef.value?.classList.remove('_active')
  setTimeout(() => {
    emit('update:visible', false)
    emit('dispose')
  }, 300)
}

watch(() => props.visible, (value) => {
  if (value) {
    emit('init')
  }
})
</script>

<style>
.mb-modal-body:not(._active) {
  transform: translateY(100%);
}
</style>
