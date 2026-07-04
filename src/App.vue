<script setup lang="ts">
import { computed, ref } from "vue";
import CharButton from "./components/CharButton.vue";
import ModifierButton from "./components/ModifierButton.vue";
import { downloadText, pickAndReadTextFile } from "./utils.ts";
import { generateCCode, generateOptimized } from "./codegen.ts";

const shiftKeyIndex = 7;
const maxModifiers = 2;
const modifierKeys = [3, 4, 7, 8, 12];
const specialKeys = [2, 53, 55, 56];

type LayersDict = Record<string, Record<number, string>>;

const keyboardState = ref<LayersDict>({
  "0": {},
});

const showKeyNumbers = ref<boolean>(false);
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

// Exclude empty layers
const getFilteredData = (): LayersDict => {
  return Object.fromEntries(Object.entries(keyboardState.value).filter(([_, val]) => Object.keys(val).length > 0));
};

const saveProject = () => {
  const text = JSON.stringify(getFilteredData(), null, 2);
  downloadText("cardputer-layout.json", "application/json", text);
};

const saveProjectC = () => {
  const text = generateCCode(getFilteredData());
  downloadText("cardputer-layout.c", "text/plain", text);
};

const saveProjectPlain = () => {
  const langCode = prompt("Enter language code (2 characters)", "en") ?? "";

  if (langCode.length == 2) {
    const text = generateOptimized(getFilteredData(), langCode);
    downloadText(`cardputer-layout-${langCode}.txt`, "text/plain", text);
  }
};

const loadProject = async () => {
  const text = await pickAndReadTextFile("json");
  keyboardState.value = JSON.parse(text);
};

const getHumanLayerName = (layerKey: string) => {
  if (layerKey === "0") return "Base";

  return layerKey
    .split("+")
    .map(Number)
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
};

const layerName = computed(() => getHumanLayerName(currentLayerKey.value));

const isModifierKey = (i: number) => modifierKeys.includes(i);

const isSpecialKey = (i: number) => specialKeys.includes(i);

const totalFilledCount = computed(() => {
  let count = 0;

  Object.entries(keyboardState.value).forEach(([_, layer]) => {
    count += Object.values(layer).filter(Boolean).length;
  });

  return count;
});

const layerBreakdown = computed(() => {
  return Object.entries(keyboardState.value)
    .map(([key, layer]) => {
      return {
        key,
        name: getHumanLayerName(key),
        count: Object.values(layer).filter(Boolean).length,
      };
    })
    .filter((layer) => layer.count > 0);
});

const findBaseKey = (n: number) => {
  if (activeModifiers.value.includes(shiftKeyIndex) && keyboardState.value[`${shiftKeyIndex}`][n]) {
    return keyboardState.value[`${shiftKeyIndex}`][n];
  }
  return keyboardState.value["0"][n];
};
</script>

<template>
  <div class="cardputer">
    <template v-for="(n, i) in 56" :key="i">
      <ModifierButton
        v-if="isModifierKey(n)"
        @click="toggleModifier(n)"
        :idx="n"
        :active="activeModifiers.includes(n)"
        :show-key-number="showKeyNumbers"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.6}%`,
        }"
      />

      <CharButton
        v-else-if="!isSpecialKey(n)"
        :idx="n"
        v-model="keyboardState[currentLayerKey][n]"
        :base-key="findBaseKey(n)"
        :show-key-number="showKeyNumbers"
        :style="{
          top: `${46.8 + (i % 4) * 13}%`,
          left: `${5.2 + Math.floor(i / 4) * 6.6}%`,
        }"
      />
    </template>
  </div>

  <div>Current layer: {{ layerName }}</div>

  <div><strong>Total filled:</strong> {{ totalFilledCount }} keys</div>

  <div>
    <ul>
      <li
        v-for="layer in layerBreakdown"
        :key="layer.key"
        class="breakdown-item"
        :class="{ current: layerName === layer.name }"
      >
        {{ layer.name }}: {{ layer.count }} keys
      </li>
    </ul>
  </div>

  <div>
    <input type="checkbox" v-model="showKeyNumbers" id="show-key-numbers" name="show-key-numbers" />
    <label for="show-key-numbers">Show key numbers</label>
  </div>

  <div class="buttons">
    <button @click="clearKeyboard">❌ Clear all</button>
    <button @click="clearLayer">❌ Clear layer</button>
    <button @click="loadProject">Load project</button>
    <button @click="saveProject">💾 Save project</button>
    <button @click="saveProjectC">💾 Export C code</button>
    <button @click="saveProjectPlain">💾 Export optimized</button>
  </div>

  <a href="https://github.com/MultiMote/cardputer-adv-layout-editor" class="code-link" target="_blank">Code</a>
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

.breakdown-item.current {
  font-weight: bold;
}
</style>
