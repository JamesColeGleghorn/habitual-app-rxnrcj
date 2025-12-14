
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useHabits } from '@/hooks/useHabits';
import { colors } from '@/styles/commonStyles';

const HABIT_ICONS = [
  { ios: 'drop.fill', android: 'water_drop', label: 'Water' },
  { ios: 'figure.walk', android: 'directions_walk', label: 'Walk' },
  { ios: 'book.fill', android: 'menu_book', label: 'Read' },
  { ios: 'bed.double.fill', android: 'bed', label: 'Sleep' },
  { ios: 'dumbbell.fill', android: 'fitness_center', label: 'Exercise' },
  { ios: 'leaf.fill', android: 'eco', label: 'Meditate' },
  { ios: 'fork.knife', android: 'restaurant', label: 'Eat Healthy' },
  { ios: 'pencil', android: 'edit', label: 'Write' },
];

const HABIT_COLORS = [
  colors.primary,
  colors.secondary,
  colors.accent,
  '#9B59B6',
  '#16A085',
  '#E67E22',
  '#3498DB',
  '#E91E63',
];

export default function AddHabitModal() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  const handleSave = async () => {
    if (name.trim()) {
      await addHabit({
        name: name.trim(),
        icon: selectedIcon.android,
        color: selectedColor,
      });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.title}>New Habit</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Drink 8 glasses of water"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Choose Icon</Text>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconOption,
                  selectedIcon.android === icon.android && styles.iconOptionSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <IconSymbol
                  ios_icon_name={icon.ios}
                  android_material_icon_name={icon.android}
                  size={28}
                  color={selectedIcon.android === icon.android ? colors.primary : colors.text}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Choose Color</Text>
          <View style={styles.colorGrid}>
            {HABIT_COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={20}
                    color={colors.card}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <Text style={styles.saveButtonText}>Create Habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '20',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.textSecondary + '20',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
