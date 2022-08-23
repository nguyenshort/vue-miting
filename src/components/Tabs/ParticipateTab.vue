<template>
  <tab-base title='Participate' :badge='agoraStore.users.length'>

    <div>
      <div
        v-for='user in agoraStore.users'
        :key='user.id'
        class='mb-4 last:mb-0'
      >
        <participate-item :user='user' />
      </div>
    </div>

  </tab-base>
</template>

<script lang='ts' setup>
const agoraStore = useAgoraStore()
</script>

<style scoped>

</style>
