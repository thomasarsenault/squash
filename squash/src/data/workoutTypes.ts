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
        color: '#f08faf',
    },
    {
        name: 'Push B',
        type: TYPES.PUSH,
        color: '#f08faf',
    },
    {
        name: 'Pull A',
        type: TYPES.PULL,
        color: '#dea1de',
    },
    {
        name: 'Pull B',
        type: TYPES.PULL,
        color: '#dea1de',
    },
    {
        name: 'Legs A',
        type: TYPES.LEGS,
        color: '#87d8f8',
    },
    {
        name: 'Legs B',
        type: TYPES.LEGS,
        color: '#87d8f8',
    },
    {
        name: 'Run',
        type: TYPES.CARDIO,
        color: '#a3dba6',
    },
    {
        name: 'Other',
        type: TYPES.OTHER,
        color: '#a3dba6',
    }
]

export default WORKOUTS;