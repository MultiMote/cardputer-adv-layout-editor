const getCMask = (layerKey: string) => {
  if (layerKey === "0") return "LAYER_MASK_BASE";

  return layerKey
    .split("+")
    .map(Number)
    .sort((a, b) => a - b)
    .map((mod) => {
      switch (mod) {
        case 3:
          return "LAYER_MASK_FN";
        case 4:
          return "LAYER_MASK_CTRL";
        case 7:
          return "LAYER_MASK_SHIFT";
        case 8:
          return "LAYER_MASK_OPT";
        case 12:
          return "LAYER_MASK_ALT";
        default:
          return "";
      }
    })
    .join(" | ");
};

export const generateCCode = (data: Record<string, Record<number, string>>): string => {
  const layers: string[] = [];
  const totalKeys = 56;
  const addBraces = false;
  const layersCount = Object.keys(data).length;

  for (const layerKey in data) {
    const layer = data[layerKey];
    const cMask = getCMask(layerKey);
    const entries: string[] = [];

    for (let n = 1; n <= totalKeys; n++) {
      let ch = layer[n];
      if (ch === undefined) {
        ch = "";
      } else {
        ch = ch.replaceAll(/[\\"]/g, m => '\\' + m);
      }
      entries.push(addBraces ? `{"${ch}"}` : `"${ch}"`);
    }

    const chunkedEntries: string[] = [];
    for (let i = 0; i < entries.length; i += 10) {
      chunkedEntries.push(entries.slice(i, i + 10).join(", "));
    }

    const formattedEntries = chunkedEntries.join(",\n        ");
    layers.push(`{(${cMask}),\n       {${formattedEntries}}}`);
  }

  return `#define TOTAL_KEYS ${totalKeys}

enum LayerMask {
  LAYER_MASK_BASE = 0x00,
  LAYER_MASK_FN = 0x01,
  LAYER_MASK_CTRL = 0x02,
  LAYER_MASK_SHIFT = 0x04,
  LAYER_MASK_OPT = 0x08,
  LAYER_MASK_ALT = 0x10
};

struct layout_entry {
  char data[4];
};

struct layout_layer {
  uint8_t modifiers_mask;
  layout_entry entries[TOTAL_KEYS];
};

struct layout_data {
  uint8_t layers_count;
  layout_layer layers[${layersCount}];
};

layout_data layout = {
    .layers_count = ${layersCount},
    .layers = {${layers.join(",\n       ")}}};
`;
};
