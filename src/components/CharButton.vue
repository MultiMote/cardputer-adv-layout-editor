<script setup lang="ts">
const props = defineProps({
  idx: { type: Number, required: true },
  modelValue: { type: String, default: "" },
  baseKey: { type: String, default: "" },
  showKeyNumber: { type: Boolean },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="cardputer-button">
    <div class="input-wrapper">
      <input
        type="text"
        size="1"
        maxlength="1"
        class="cardputer-input"
        :tabindex="props.idx"
        :value="modelValue"
        :placeholder="`${baseKey}`"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <div class="key-number" v-if="showKeyNumber">
        {{ props.idx }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cardputer-button {
  position: absolute;
  width: 24px;
  height: 20px;
}
.input-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.cardputer-input {
  width: 100%;
  height: 100%;
  font-size: 0.9rem;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #aaa;
  background-color: transparent;
  color: #00fafa;
  font-weight: bold;
}

.key-number {
  position: absolute;
  font-size: 0.7rem;
  bottom: -1.2em;
  right: -1.5em;
  color: #535353;
}
</style>
