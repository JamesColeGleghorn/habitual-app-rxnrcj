
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname.includes(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={tab.icon}
                android_material_icon_name={tab.icon}
                size={24}
                color={active ? colors.primary : colors.text}
              />
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginTop: 4,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
