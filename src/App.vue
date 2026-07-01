<script setup lang="ts">
import { computed, ref } from "vue";
import CharButton from "./components/CharButton.vue";
import ModifierButton from "./components/ModifierButton.vue";
import { downloadText, pickAndReadTextFile } from "./utils.ts";

const keyboardState = ref<Record<number, Record<number, string>>>({
  0: {}, // Base layer
  3: {}, // Fn layer
  4: {}, // Ctrl layer
  7: {}, // Shift layer
  8: {}, // Opt layer
  12: {}, // Alt layer
});

const currentModifier = ref<number>(0);

const clearKeyboard = () => {
  keyboardState.value = { 0: {}, 3: {}, 4: {}, 7: {}, 8: {}, 12: {} };
};

const clearLayer = () => {
  keyboardState.value[currentModifier.value] = {};
};

const saveProject = () => {
  const jsonText = JSON.stringify(keyboardState.value, null, 2);
  downloadText("cardputer-layout.json", "application/json", jsonText);
};

const loadProject = async () => {
  const text = await pickAndReadTextFile("json");
  keyboardState.value = JSON.parse(text);
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

const isSpecialKey = (i: number) => {
  return [2, 53, 55, 56].includes(i);
};

const totalFilledCount = computed(() => {
  let count = 0;

  Object.entries(keyboardState.value).forEach(([_, layer]) => {
    count += Object.values(layer).filter(Boolean).length;
  });

  return count;
});
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
          left: `${5.2 + Math.floor(i / 4) * 6.6}%`,
        }"
      />

      <CharButton
        v-else-if="!isSpecialKey(n)"
        :idx="n"
        v-model="keyboardState[currentModifier][n]"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.6}%`,
        }"
      />
    </template>
  </div>

  <div>Layer: {{ modifierName(currentModifier) }}</div>
  <div>Total filled: {{ totalFilledCount }} keys</div>

  <div class="buttons">
    <button @click="clearKeyboard">❌ Clear all</button>
    <button @click="clearLayer">❌Clear layer</button>
    <button @click="saveProject">💾 Save project</button>
    <button @click="loadProject">Load project</button>
  </div>
</template>

<style scoped>
.cardputer {
  position: relative;
  width: 885px;
  height: 584px;
  background: url("/cardputer.webp") no-repeat center center;
}
.buttons {
  display: flex;
  gap: 8px;
}
</style>
