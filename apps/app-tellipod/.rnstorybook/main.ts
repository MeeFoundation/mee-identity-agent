import type { StorybookConfig } from '@storybook/react-native'

const main: StorybookConfig = {
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
  stories: [
    { directory: '../../../packages/ui/src', files: '**/*.stories.?(ts|tsx)', titlePrefix: 'UI' },
    { directory: '../src', files: '**/*.stories.?(ts|tsx)', titlePrefix: 'Tellipod' },
  ],
}

export default main
