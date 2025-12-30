
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';
import type { CodeLanguage } from '@/types/codeCompletion';

interface LanguageSelectorProps {
  selectedLanguage: CodeLanguage;
  onSelectLanguage: (language: CodeLanguage) => void;
}

const LANGUAGES: { value: CodeLanguage; label: string; icon: string }[] = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS' },
  { value: 'python', label: 'Python', icon: 'PY' },
  { value: 'java', label: 'Java', icon: 'JV' },
  { value: 'cpp', label: 'C++', icon: 'C++' },
  { value: 'csharp', label: 'C#', icon: 'C#' },
  { value: 'go', label: 'Go', icon: 'GO' },
  { value: 'rust', label: 'Rust', icon: 'RS' },
  { value: 'swift', label: 'Swift', icon: 'SW' },
  { value: 'kotlin', label: 'Kotlin', icon: 'KT' },
  { value: 'php', label: 'PHP', icon: 'PHP' },
  { value: 'ruby', label: 'Ruby', icon: 'RB' },
  { value: 'html', label: 'HTML', icon: 'HTML' },
  { value: 'css', label: 'CSS', icon: 'CSS' },
  { value: 'sql', label: 'SQL', icon: 'SQL' },
];

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
}: LanguageSelectorProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Language</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.value;
          return (
            <TouchableOpacity
              key={lang.value}
              style={[
                styles.langButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : '#E0E0E0',
                },
              ]}
              onPress={() => onSelectLanguage(lang.value)}
            >
              <Text
                style={[
                  styles.langIcon,
                  { color: isSelected ? '#FFFFFF' : colors.primary },
                ]}
              >
                {lang.icon}
              </Text>
              <Text
                style={[
                  styles.langLabel,
                  { color: isSelected ? '#FFFFFF' : colors.text },
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  scroll: {
    flexDirection: 'row',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  langIcon: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  langLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
