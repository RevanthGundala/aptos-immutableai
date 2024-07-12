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
