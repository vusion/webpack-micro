module.exports = {
    roots: ['<rootDir>/tests/'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    "testEnvironment": "node",
    testRegex: '/tests/.*\\.test\\.ts$',
};
