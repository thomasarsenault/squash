const TYPES = {
    PUSH: 'PUSH',
    PULL: 'PULL',
    LEGS: 'LEGS',
    CARDIO: 'CARDIO',
    OTHER: 'OTHER',
}

const WORKOUTS = [
    {
        name: 'Push A',
        type: TYPES.PUSH,
    },
    {
        name: 'Push B',
        type: TYPES.PUSH,
    },
    {
        name: 'Pull A',
        type: TYPES.PULL,
    },
    {
        name: 'Pull B',
        type: TYPES.PULL,
    },
    {
        name: 'Legs A',
        type: TYPES.LEGS,
    },
    {
        name: 'Legs B',
        type: TYPES.LEGS,
    },
    {
        name: 'Run',
        type: TYPES.CARDIO,
    },
    {
        name: 'Other',
        type: TYPES.OTHER,
    }
]

export default WORKOUTS;