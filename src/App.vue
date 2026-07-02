<script setup lang="ts">
import { computed, ref } from "vue";
import CharButton from "./components/CharButton.vue";
import ModifierButton from "./components/ModifierButton.vue";
import { downloadText, pickAndReadTextFile } from "./utils.ts";

const maxModifiers = 2;
const modifierKeys = [3, 4, 7, 8, 12];
const specialKeys = [2, 53, 55, 56];

const keyboardState = ref<Record<string, Record<number, string>>>({
  "0": {},
});

const activeModifiers = ref<number[]>([]);

const currentLayerKey = computed(() => {
  if (activeModifiers.value.length === 0) {
    return "0";
  }
  return [...activeModifiers.value].sort((a, b) => a - b).join("+");
});

const toggleModifier = (n: number) => {
  const index = activeModifiers.value.indexOf(n);

  if (index > -1) {
    activeModifiers.value.splice(index, 1);
  } else {
    if (activeModifiers.value.length >= maxModifiers) {
      return;
    }
    activeModifiers.value.push(n);
  }

  if (!keyboardState.value[currentLayerKey.value]) {
    keyboardState.value[currentLayerKey.value] = {};
  }
};

const clearKeyboard = () => {
  keyboardState.value = { "0": {} };
  activeModifiers.value = [];
};

const clearLayer = () => {
  keyboardState.value[currentLayerKey.value] = {};
};

const saveProject = () => {
  const jsonText = JSON.stringify(keyboardState.value, null, 2);
  downloadText("cardputer-layout.json", "application/json", jsonText);
};

const loadProject = async () => {
  const text = await pickAndReadTextFile("json");
  keyboardState.value = JSON.parse(text);
};

const layerName = computed(() => {
  if (activeModifiers.value.length === 0) {
    return "Base";
  }

  return [...activeModifiers.value]
    .sort((a, b) => a - b)
    .map((mod) => {
      switch (mod) {
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
          return "";
      }
    })
    .join("+");
});

const isModifierKey = (i: number) => modifierKeys.includes(i);

const isSpecialKey = (i: number) => specialKeys.includes(i);

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
        v-model="keyboardState['0'][n]"
        :active="activeModifiers.includes(n)"
        @click="toggleModifier(n)"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.6}%`,
        }"
      />

      <CharButton
        v-else-if="!isSpecialKey(n)"
        :idx="n"
        v-model="keyboardState[currentLayerKey][n]"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.6}%`,
        }"
      />
    </template>
  </div>

  <div>Layer: {{ layerName }}</div>
  <div>Total filled: {{ totalFilledCount }} keys</div>

  <div class="buttons">
    <button @click="clearKeyboard">❌ Clear all</button>
    <button @click="clearLayer">❌Clear layer</button>
    <button @click="saveProject">💾 Save project</button>
    <button @click="loadProject">Load project</button>
  </div>

  <a
    href="https://github.com/MultiMote/cardputer-adv-layout-editor"
    class="code-link"
    target="_blank"
    >Code</a
  >
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

.code-link {
  margin-top: 2rem;
}
</style>
