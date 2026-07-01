<script setup lang="ts">
const props = defineProps({
  idx: { type: Number, required: true },
  modelValue: { type: String, default: "" }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    type="text"
    size="1"
    maxlength="1"
    class="cardputer-button"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
  .cardputer-button {
      position: absolute;
      width: 24px;
      height: 20px;
      font-size: 1.1rem;
      text-align: center;
      border-radius: 8px;
      border: 1px solid #aaa;
      background-color: transparent;
      color: #00fafa;
      font-weight: bold;

  }
</style>