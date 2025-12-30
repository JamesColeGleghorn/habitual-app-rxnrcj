
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';
import { useCodeCompletion } from '@/hooks/useCodeCompletion';
import CodeEditor from '@/components/CodeEditor';
import CompletionSuggestion from '@/components/CompletionSuggestion';
import ModelSelector from '@/components/ModelSelector';
import LanguageSelector from '@/components/LanguageSelector';
import SetupGuide from '@/components/SetupGuide';
import { IconSymbol } from '@/components/IconSymbol';
import type { CodeLanguage, CodeCompletionModel, CompletionHistory } from '@/types/codeCompletion';
import { saveCompletionToHistory, getCompletionHistory } from '@/utils/codeCompletionStorage';

export default function CodeCompletionScreen() {
  const colors = useThemeColors();
  const { complete, loading, error, data, reset } = useCodeCompletion();

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [model, setModel] = useState<CodeCompletionModel>('deepseek/deepseek-coder');
  const [showCompletion, setShowCompletion] = useState(false);
  const [history, setHistory] = useState<CompletionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const h = await getCompletionHistory();
    setHistory(h);
  };

  const handleComplete = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter some code first');
      return;
    }

    reset();
    setShowCompletion(true);

    const result = await complete({
      code,
      language,
      model,
      temperature: 0.2,
      maxTokens: 500,
    });

    if (result) {
      const historyItem: CompletionHistory = {
        id: Date.now().toString(),
        code,
        completion: result.completion,
        language,
        model: result.model,
        timestamp: Date.now(),
      };
      await saveCompletionToHistory(historyItem);
      await loadHistory();
    }
  };

  const handleAcceptCompletion = () => {
    if (data?.completion) {
      setCode(code + '\n' + data.completion);
      setShowCompletion(false);
      reset();
    }
  };

  const handleRejectCompletion = () => {
    setShowCompletion(false);
    reset();
  };

  const handleLoadFromHistory = (item: CompletionHistory) => {
    setCode(item.code);
    setLanguage(item.language);
    setShowHistory(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <IconSymbol
              ios_icon_name="chevron.left.forwardslash.chevron.right"
              android_material_icon_name="code"
              size={28}
              color={colors.primary}
            />
            <Text style={[styles.title, { color: colors.text }]}>
              Code Completion
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            AI-powered code suggestions using OpenRouter
          </Text>
        </View>

        <SetupGuide />

        <LanguageSelector
          selectedLanguage={language}
          onSelectLanguage={setLanguage}
        />

        <ModelSelector
          selectedModel={model}
          onSelectModel={setModel}
        />

        <View style={styles.editorSection}>
          <View style={styles.editorHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Code
            </Text>
            {history.length > 0 && (
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => setShowHistory(!showHistory)}
              >
                <IconSymbol
                  ios_icon_name="clock.arrow.circlepath"
                  android_material_icon_name="history"
                  size={18}
                  color={colors.primary}
                />
                <Text style={[styles.historyButtonText, { color: colors.primary }]}>
                  History ({history.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {showHistory && (
            <View style={[styles.historyPanel, { backgroundColor: colors.card }]}>
              <Text style={[styles.historyTitle, { color: colors.text }]}>
                Recent Completions
              </Text>
              <ScrollView style={styles.historyScroll} nestedScrollEnabled>
                {history.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.historyItem, { borderBottomColor: colors.textSecondary }]}
                    onPress={() => handleLoadFromHistory(item)}
                  >
                    <View style={styles.historyItemHeader}>
                      <Text style={[styles.historyItemLang, { color: colors.primary }]}>
                        {item.language.toUpperCase()}
                      </Text>
                      <Text style={[styles.historyItemDate, { color: colors.textSecondary }]}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[styles.historyItemCode, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {item.code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            placeholder={`Write your ${language} code here...`}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: colors.primary },
            loading && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <React.Fragment>
              <IconSymbol
                ios_icon_name="sparkles"
                android_material_icon_name="auto_awesome"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.completeButtonText}>
                Generate Completion
              </Text>
            </React.Fragment>
          )}
        </TouchableOpacity>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.accent + '20' }]}>
            <IconSymbol
              ios_icon_name="exclamationmark.triangle"
              android_material_icon_name="error"
              size={20}
              color={colors.accent}
            />
            <Text style={[styles.errorText, { color: colors.accent }]}>
              {error}
            </Text>
          </View>
        )}

        {showCompletion && (
          <View style={styles.completionSection}>
            <CompletionSuggestion
              completion={data?.completion || ''}
              onAccept={handleAcceptCompletion}
              onReject={handleRejectCompletion}
              loading={loading}
              model={data?.model}
              duration={data?.duration_ms}
            />
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            How to use:
          </Text>
          <View style={styles.infoList}>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              - Select your programming language
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              - Choose an AI model for completion
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              - Write your code in the editor
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              - Tap &quot;Generate Completion&quot; for AI suggestions
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              - Accept or reject the suggestion
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  editorSection: {
    marginVertical: 16,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  historyButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  historyPanel: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  historyScroll: {
    maxHeight: 250,
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyItemLang: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  historyItemDate: {
    fontSize: 11,
  },
  historyItemCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 16,
    gap: 8,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  completionSection: {
    marginVertical: 16,
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(41, 171, 226, 0.1)',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoList: {
    gap: 6,
  },
  infoItem: {
    fontSize: 13,
    lineHeight: 20,
  },
});
