
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';

interface CodeEditorProps {
  value: string;
  onChange: (text: string) => void;
  language: string;
  placeholder?: string;
  editable?: boolean;
  showLineNumbers?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder = 'Start typing your code...',
  editable = true,
  showLineNumbers = true,
}: CodeEditorProps) {
  const colors = useThemeColors();
  const [cursorPosition, setCursorPosition] = useState(0);

  const lines = value.split('\n');
  const lineCount = lines.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.languageLabel, { color: colors.text }]}>
          {language.toUpperCase()}
        </Text>
      </View>
      <View style={styles.editorContainer}>
        {showLineNumbers && (
          <View style={[styles.lineNumbers, { backgroundColor: colors.background }]}>
            {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
              <Text key={i} style={[styles.lineNumber, { color: colors.textSecondary }]}>
                {i + 1}
              </Text>
            ))}
          </View>
        )}
        <ScrollView style={styles.codeScroll} nestedScrollEnabled>
          <TextInput
            style={[
              styles.codeInput,
              { color: colors.text },
            ]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline
            editable={editable}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  editorContainer: {
    flexDirection: 'row',
    minHeight: 200,
    maxHeight: 400,
  },
  lineNumbers: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  lineNumber: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 20,
    textAlign: 'right',
    minWidth: 30,
  },
  codeScroll: {
    flex: 1,
  },
  codeInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    minHeight: 200,
  },
});
