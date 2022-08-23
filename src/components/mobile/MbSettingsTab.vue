<template>
  <mb-base-modal
    :visible="roomStore.sidebar === 'settings'"
    title="Cài Đặt"
    @dispose="roomStore.sidebar = undefined"
  >
    <div>
      <h5 class="text-[17px] font-semibold">Bố Cục</h5>

      <div>
        <div
          class="flex items-center transition cursor-pointer"
          :class="{
            'text-primary-600': roomStore.layout === 'sidebar'
          }"
          @click='roomStore.layout = "sidebar"'
        >
          <i-bi-layout-sidebar-inset-reverse />
          <span class="ml-2 text-[14px]"> Tiêu Điểm </span>
        </div>

        <div
          class="flex items-center transition mt-2 cursor-pointer"
          :class="{
            'text-primary-600': roomStore.layout === 'grid'
          }"
          @click='agoraStore.users.length > 1 && (roomStore.layout = "grid")'
        >
          <i-material-symbols-grid-view-rounded />
          <span class="ml-2 text-[14px]"> Lưới Thu Gọn </span>
        </div>
      </div>

      <h5 class="text-[17px] font-semibold mt-5">Âm báo tin nhắn</h5>

      <div>
        <a-switch v-model:checked="roomStore.messageSound" />
        <div class='text-xs mt-2 text-gray-400'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
      </div>

      <h5 class="text-[17px] font-semibold mt-5">Kích thước</h5>

      <div>
        <div
          class="flex items-center transition cursor-pointer"
          :class="{
            'text-primary-600': roomStore.display === 'normal'
          }"
          @click='roomStore.display = "normal"'
        >
          <i-fluent-resize-large-20-filled />
          <span class="ml-2 text-[14px]"> Tiêu Chuẩn </span>
        </div>

        <div
          class="flex items-center transition mt-2 cursor-pointer"
          :class="{
            'text-primary-600': roomStore.display === 'mini'
          }"
          @click='roomStore.display = "mini"'
        >
          <i-fluent-resize-small-24-filled />
          <span class="ml-2 text-[14px]"> Thu Phóng </span>
        </div>
      </div>

      <div class='text-xs mt-2 text-gray-400 border-t border-gray-100 pt-3 mt-2'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>

    </div>
  </mb-base-modal>
</template>

<script lang="ts" setup>
const roomStore = useRoomStore()
const agoraStore = useAgoraStore()
</script>
