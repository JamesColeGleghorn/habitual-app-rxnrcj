
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        color: DynamicColorIOS({
          dark: 'white',
          light: 'black',
        }),
      }}
      tintColor={DynamicColorIOS({
        dark: '#29ABE2',
        light: '#29ABE2',
      })}
    >
      <NativeTabs.Trigger name="(home)">
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Progress</Label>
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
