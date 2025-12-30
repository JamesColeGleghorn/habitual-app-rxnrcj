
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface SetupGuideProps {
  onDismiss?: () => void;
}

export default function SetupGuide({ onDismiss }: SetupGuideProps) {
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  const openOpenRouter = () => {
    Linking.openURL('https://openrouter.ai/keys');
  };

  const openSupabaseDashboard = () => {
    Linking.openURL('https://supabase.com/dashboard/project/tylsyqzwhpjvkzuijmtf/settings/functions');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Setup Required
          </Text>
        </View>
        <IconSymbol
          ios_icon_name={expanded ? 'chevron.up' : 'chevron.down'}
          android_material_icon_name={expanded ? 'expand_less' : 'expand_more'}
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            To use the code completion tool, you need to set up your OpenRouter API key:
          </Text>

          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  Get OpenRouter API Key
                </Text>
                <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                  Sign up at OpenRouter and create an API key
                </Text>
                <TouchableOpacity
                  style={[styles.linkButton, { borderColor: colors.primary }]}
                  onPress={openOpenRouter}
                >
                  <Text style={[styles.linkButtonText, { color: colors.primary }]}>
                    Open OpenRouter
                  </Text>
                  <IconSymbol
                    ios_icon_name="arrow.up.right"
                    android_material_icon_name="open_in_new"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  Add to Supabase
                </Text>
                <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                  Go to Supabase Dashboard → Edge Functions → Secrets
                </Text>
                <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                  Add a new secret: OPENROUTER_API_KEY
                </Text>
                <TouchableOpacity
                  style={[styles.linkButton, { borderColor: colors.primary }]}
                  onPress={openSupabaseDashboard}
                >
                  <Text style={[styles.linkButtonText, { color: colors.primary }]}>
                    Open Supabase Dashboard
                  </Text>
                  <IconSymbol
                    ios_icon_name="arrow.up.right"
                    android_material_icon_name="open_in_new"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  Start Coding!
                </Text>
                <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                  Once configured, you can start using AI-powered code completion
                </Text>
              </View>
            </View>
          </View>

          {onDismiss && (
            <TouchableOpacity
              style={[styles.dismissButton, { backgroundColor: colors.primary }]}
              onPress={onDismiss}
            >
              <Text style={styles.dismissButtonText}>Got it!</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  steps: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dismissButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
