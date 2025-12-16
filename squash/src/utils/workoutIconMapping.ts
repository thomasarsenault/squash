export const workoutIconMapping: Record<string, () => Promise<{ default: string }>> = {
  'biking.svg': () => import('@/assets/workouts/biking.svg'),
  'climbing.svg': () => import('@/assets/workouts/climbing.svg'),
  'lifting.svg': () => import('@/assets/workouts/lifting.svg'),
  'mats.svg': () => import('@/assets/workouts/mats.svg'),
  'running.svg': () => import('@/assets/workouts/running.svg'),
  'sports.svg': () => import('@/assets/workouts/sports.svg'),
};

export async function getWorkoutIcon(iconName: string): Promise<string> {
  const iconLoader = workoutIconMapping[iconName] || workoutIconMapping['lifting.svg'];
  const module = await iconLoader();
  return module.default;
}

export default workoutIconMapping;
