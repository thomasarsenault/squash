const TYPES = {
  PUSH: 'PUSH',
  PULL: 'PULL',
  LEGS: 'LEGS',
  CARDIO: 'CARDIO',
  OTHER: 'OTHER',
};

const WORKOUTS = [
  {
    name: 'Push A',
    type: TYPES.PUSH,
    icon: 'lifting.svg',
  },
  {
    name: 'Push B',
    type: TYPES.PUSH,
    icon: 'lifting.svg',
  },
  {
    name: 'Pull',
    type: TYPES.PULL,
    icon: 'lifting.svg',
  },
  {
    name: 'Legs',
    type: TYPES.LEGS,
    icon: 'lifting.svg',
  },
  {
    name: 'Core',
    type: TYPES.LEGS,
    icon: 'mats.svg',
  },
  {
    name: 'Run',
    type: TYPES.CARDIO,
    icon: 'running.svg',
  },
  {
    name: 'Bike',
    type: TYPES.CARDIO,
    icon: 'biking.svg',
  },
  {
    name: 'Climbing',
    type: TYPES.PULL,
    icon: 'climbing.svg',
  },
  {
    name: 'Sports',
    type: TYPES.CARDIO,
    icon: 'sports.svg',
  },
  {
    name: 'Other',
    type: TYPES.OTHER,
    icon: 'lifting.svg',
  },
];

export default WORKOUTS;
