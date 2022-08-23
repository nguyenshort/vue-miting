<template>
  <div
    class="text-gray-600 min-h-screen"
  >
    <div :id="String($route.name || 'index')">
      <router-view />
    </div>
    <confirm-modal />
    <auth-modal />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
