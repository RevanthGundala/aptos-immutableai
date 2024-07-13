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
  "0x85e2c05be51e876b354bac4ec31fddb3cc4c475b241025cbea225f3ab2b2ec5b";
