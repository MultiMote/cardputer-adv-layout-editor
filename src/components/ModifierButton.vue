<script setup lang="ts">
const props = defineProps({
  active: { type: Boolean, required: true },
})

</script>

<template>
  <button class="modifier-button" :class="{ 'active': props.active }">

  </button>
</template>

<style scoped>
  .modifier-button {
      position: absolute;
      width: 17px;
      height: 20px;
      border-radius: 8px;
      border: 1px solid #084400;
      background-color: #b8dbb1;
      color: #00fafa;
      cursor: pointer;
  }

  .modifier-button.active {
      background-color: #e01818;
  }
</style>