<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WORKOUTS from '@/data/workoutTypes';
import { getWorkoutIcon } from '@/utils/workoutIconMapping';

const props = defineProps<{
  type?: string;
  size?: 'small' | 'small-on-mobile';
}>();

const workoutType = WORKOUTS.find((type) => type.name === props.type);
const icon = ref<string>('');

onMounted(async () => {
  const iconName = workoutType?.icon || 'lifting.svg';
  icon.value = await getWorkoutIcon(iconName);
});
</script>
<template>
  <img :class="`dot ${type} ${props.size || ''}`" :src="icon" />
</template>

<style scoped lang="scss">
.dot {
  width: 1.25rem;
  height: 1.25rem;
  padding: 2px;
  border-radius: 4px;
  background-color: #bfbfbf;

  &.small {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.small-on-mobile {
    @include breakpoint('mobile') {
      width: 1rem;
      height: 1rem;
    }
  }
}

// TODO: colors as vars
.Push {
  &.A {
    background-color: #ef8d8d;
  }

  &.B {
    background-color: #efae8d;
  }
}

.Pull,
.Climbing {
  background-color: rgb(201, 145, 228);
}

.Legs,
.Sports {
  background-color: #87d8f8;
}

.Core {
  background-color: rgb(153, 144, 210);
}

.Run,
.Bike {
  background-color: rgb(129, 206, 134);
}

.Other {
  background-color: #bfbfbf;
}
</style>
