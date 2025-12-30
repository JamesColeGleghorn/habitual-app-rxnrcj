
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';
import type { CodeCompletionModel } from '@/types/codeCompletion';

interface ModelSelectorProps {
  selectedModel: CodeCompletionModel;
  onSelectModel: (model: CodeCompletionModel) => void;
}

const MODELS: { value: CodeCompletionModel; label: string; description: string }[] = [
  {
    value: 'deepseek/deepseek-coder',
    label: 'DeepSeek Coder',
    description: 'Fast and accurate code completion',
  },
  {
    value: 'anthropic/claude-3.5-sonnet',
    label: 'Claude 3.5 Sonnet',
    description: 'Advanced reasoning and code understanding',
  },
  {
    value: 'openai/gpt-4-turbo',
    label: 'GPT-4 Turbo',
    description: 'Powerful general-purpose model',
  },
  {
    value: 'meta-llama/codellama-34b-instruct',
    label: 'Code Llama 34B',
    description: 'Specialized for code generation',
  },
  {
    value: 'mistralai/codestral-latest',
    label: 'Codestral',
    description: 'Efficient code completion',
  },
];

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Select Model</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.value;
          return (
            <TouchableOpacity
              key={model.value}
              style={[
                styles.modelCard,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : '#E0E0E0',
                },
              ]}
              onPress={() => onSelectModel(model.value)}
            >
              <Text
                style={[
                  styles.modelLabel,
                  { color: isSelected ? '#FFFFFF' : colors.text },
                ]}
              >
                {model.label}
              </Text>
              <Text
                style={[
                  styles.modelDescription,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {model.description}
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
  modelCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 160,
    maxWidth: 200,
  },
  modelLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
});
