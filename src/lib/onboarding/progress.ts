type ProgressStep = {
  required: boolean;
  completed: boolean;
};

export function getRequiredProgress(steps: ProgressStep[]) {
  const requiredSteps = steps.filter((step) => step.required);
  const completedRequiredSteps = requiredSteps.filter((step) => step.completed).length;
  const totalRequiredSteps = requiredSteps.length;
  const percentComplete =
    totalRequiredSteps > 0 ? (completedRequiredSteps / totalRequiredSteps) * 100 : 0;

  return {
    requiredSteps: requiredSteps.length,
    completedRequiredSteps,
    percentComplete,
    isComplete: totalRequiredSteps > 0 && completedRequiredSteps === totalRequiredSteps,
  };
}
