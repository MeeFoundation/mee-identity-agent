const path = require('node:path')

const reactNativeDir = path.dirname(require.resolve('react-native/package.json'))
const expoModulesCoreDir = path.dirname(
  require.resolve('expo-modules-core/package.json', { paths: [require.resolve('expo/package.json')] }),
)

module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^expo-modules-core(/.*)?$': `${expoModulesCoreDir}$1`,
    '^react-native/((?:Libraries|src)/.*)$': `${reactNativeDir}/$1`,
    '^react-native/react-private-interface$': `${reactNativeDir}/src/react-private-interface.js`,
    '^react-native/setup-env$': `${reactNativeDir}/src/setup-env.js`,
    '^react-native$': `${reactNativeDir}/index.js`,
  },
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
