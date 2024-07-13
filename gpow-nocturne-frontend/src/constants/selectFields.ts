export type options = {
  label: string;
  value: string;
};

export const jobTypes: options[] = [
  { label: "Docker", value: "docker" },
  { label: "K8s", value: "k8s" },
  { label: "Petals", value: "petals" },
];

export const dockerImages: options[] = [
  { label: "Training Image", value: "immu-ai/training:latest" },
  { label: "Bias Detection Image", value: "immu-ai/bias-detection:latest" },
  { label: "Petals Image", value: "immu-ai/petals:latest" },
];

export const CONTRACT_ADDRESS =
  "0x5d5cd124b058bc5b0bdc4ab0b58a3511e4605f78f1403ca794a3fe3a83e78d8d";
