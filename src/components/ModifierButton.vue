<script setup lang="ts">
const props = defineProps({
  idx: { type: Number, required: true },
  active: { type: Boolean, required: true },
})

</script>

<template>
  <button class="modifier-button" :class="{ 'active': props.active }">
    {{ props.idx }}
  </button>
</template>

<style scoped>
  .modifier-button {
      position: absolute;
      width: 30px;
      height: 23px;
      border-radius: 8px;
      border: 1px solid #084400;
      background-color: #b8dbb1;
      color: #858585;
      font-weight: bold;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;

  }

  .modifier-button.active {
      background-color: #e01818;
      color: #dddddd;

  }
</style>