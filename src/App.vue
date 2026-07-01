<script setup lang="ts">
import { ref } from "vue";
import CharButton from "./components/CharButton.vue";
import ModifierButton from "./components/ModifierButton.vue";

const keyboardState = ref<Record<number, Record<number, string>>>({
  0: {},  // Base layer
  3: {},  // Fn layer
  4: {},  // Ctrl layer
  7: {},  // Shift layer
  8: {},  // Opt layer
  12: {}, // Alt layer
});

const currentModifier = ref<number>(0);

const clearKeyboard = () => {
  // Clear only the active layer, or clear everything by resetting the object
  keyboardState.value = { 0: {}, 3: {}, 4: {}, 7: {}, 8: {}, 12: {} };
};

const modifierName = (i: number) => {
  switch (i) {
    case 3:
      return "Fn";
    case 4:
      return "Ctrl";
    case 7:
      return "Shift";
    case 8:
      return "Opt";
    case 12:
      return "Alt";
    default:
      return "Base";
  }
};

const isModifierKey = (i: number) => {
  return [3, 4, 7, 8, 12].includes(i);
};
</script>

<template>
  <div class="cardputer">
    <template v-for="(n, i) in 56" :key="i">
      <ModifierButton
        v-if="isModifierKey(n)"
        :idx="n"
        v-model="keyboardState[0][n]"
        :active="currentModifier === n"
        @click="currentModifier = currentModifier === n ? 0 : n"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.60}%`,
        }"
      />

      <CharButton
        v-else
        :idx="n"
        v-model="keyboardState[currentModifier][n]"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.60}%`,
        }"
      />
    </template>
  </div>

  <button @click="clearKeyboard">Clear</button>

  <div>Layer: {{ modifierName(currentModifier) }}</div>

  <pre>{{ JSON.stringify(keyboardState, null, 2) }}</pre>
</template>

<style scoped>
.cardputer {
  position: relative;
  width: 885px;
  height: 584px;
  background: url("/cardputer.webp") no-repeat center center;
}
</style>