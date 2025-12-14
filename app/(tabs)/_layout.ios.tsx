
import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'house.fill' : 'house',
          }),
        }}
      />
      <NativeTabs.Screen
        name="profile"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'chart.bar.fill' : 'chart.bar',
          }),
        }}
      />
    </NativeTabs>
  );
}
