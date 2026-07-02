<script setup lang="ts">
const props = defineProps({
  idx: { type: Number, required: true },
  active: { type: Boolean, required: true },
  showKeyNumber: { type: Boolean },
})

</script>

<template>
  <button class="modifier-button" :class="{ 'active': props.active }">
    <span v-if="props.showKeyNumber">{{ props.idx }}</span>
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
      color: #686868;
      font-weight: bold;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0;

  }

  .modifier-button.active {
      background-color: #e01818;
      color: #dddddd;

  }
</style>
