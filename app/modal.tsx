
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import { useHabits } from '@/hooks/useHabits';
import { useThemeColors } from '@/styles/commonStyles';

const HABIT_ICONS = [
  { ios: 'waterbottle.fill', android: 'water_drop', label: 'Water' },
  { ios: 'figure.run', android: 'directions_run', label: 'Run' },
  { ios: 'book.pages.fill', android: 'menu_book', label: 'Read' },
  { ios: 'bed.double.fill', android: 'bed', label: 'Sleep' },
  { ios: 'dumbbell.fill', android: 'fitness_center', label: 'Exercise' },
  { ios: 'leaf.fill', android: 'spa', label: 'Meditate' },
  { ios: 'fork.knife', android: 'restaurant', label: 'Eat Healthy' },
  { ios: 'pencil', android: 'edit', label: 'Write' },
];

export default function AddHabitModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload a custom image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCustomImage(result.assets[0].uri);
        console.log('Custom image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeCustomImage = () => {
    setCustomImage(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      await addHabit({
        name: name.trim(),
        icon: selectedIcon.android,
        color: selectedColor,
        customImage: customImage || undefined,
      });
      router.back();
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 48 : insets.top + 16 }]}>
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

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Drink 8 glasses of water"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            editable={!saving}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Custom Photo (Optional)</Text>
          <Text style={styles.helperText}>
            Upload a custom photo or use default icons below
          </Text>
          
          {customImage ? (
            <View style={styles.customImageContainer}>
              <Image 
                source={{ uri: customImage }} 
                style={styles.customImagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={removeCustomImage}
                disabled={saving}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickImage}
              disabled={saving}
            >
              <IconSymbol
                ios_icon_name="photo.badge.plus"
                android_material_icon_name="add_photo_alternate"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.uploadButtonText}>Upload Custom Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {!customImage && (
          <React.Fragment>
            <View style={styles.section}>
              <Text style={styles.label}>Choose Icon</Text>
              <Text style={styles.helperText}>
                Default icons will be used based on habit name
              </Text>
              <View style={styles.iconGrid}>
                {HABIT_ICONS.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.iconOption,
                      selectedIcon.android === icon.android && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                    disabled={saving}
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
                    disabled={saving}
                  >
                    {selectedColor === color && (
                      <IconSymbol
                        ios_icon_name="checkmark"
                        android_material_icon_name="check"
                        size={20}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </React.Fragment>
        )}

        <TouchableOpacity
          style={[styles.saveButton, (!name.trim() || saving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim() || saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Creating...' : 'Create Habit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
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
  uploadButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '40',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  customImageContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  customImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.card,
    borderRadius: 14,
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
  },
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
