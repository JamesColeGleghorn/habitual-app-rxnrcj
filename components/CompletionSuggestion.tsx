
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface CompletionSuggestionProps {
  completion: string;
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
  model?: string;
  duration?: number;
}

export default function CompletionSuggestion({
  completion,
  onAccept,
  onReject,
  loading = false,
  model,
  duration,
}: CompletionSuggestionProps) {
  const colors = useThemeColors();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Generating completion...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol
            ios_icon_name="sparkles"
            android_material_icon_name="auto_awesome"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            AI Suggestion
          </Text>
        </View>
        {model && (
          <Text style={[styles.modelText, { color: colors.textSecondary }]}>
            {model.split('/')[1] || model}
          </Text>
        )}
      </View>
      <ScrollView style={styles.completionScroll} nestedScrollEnabled>
        <Text style={[styles.completionText, { color: colors.text }]}>
          {completion}
        </Text>
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton, { borderColor: colors.textSecondary }]}
          onPress={onReject}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
            Reject
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton, { backgroundColor: colors.primary }]}
          onPress={onAccept}
        >
          <IconSymbol
            ios_icon_name="checkmark"
            android_material_icon_name="check"
            size={18}
            color="#FFFFFF"
          />
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
            Accept
          </Text>
        </TouchableOpacity>
      </View>
      {duration && (
        <Text style={[styles.durationText, { color: colors.textSecondary }]}>
          Generated in {duration}ms
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  modelText: {
    fontSize: 11,
    fontWeight: '500',
  },
  completionScroll: {
    maxHeight: 200,
    marginBottom: 12,
  },
  completionText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  rejectButton: {
    borderWidth: 1,
  },
  acceptButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});
