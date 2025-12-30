
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompletionHistory } from '@/types/codeCompletion';

const HISTORY_KEY = 'code_completion_history';
const MAX_HISTORY_ITEMS = 50;

export async function saveCompletionToHistory(item: CompletionHistory): Promise<void> {
  try {
    const existing = await getCompletionHistory();
    const updated = [item, ...existing].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving completion to history:', error);
  }
}

export async function getCompletionHistory(): Promise<CompletionHistory[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting completion history:', error);
    return [];
  }
}

export async function clearCompletionHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing completion history:', error);
  }
}

export async function deleteCompletionFromHistory(id: string): Promise<void> {
  try {
    const existing = await getCompletionHistory();
    const updated = existing.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting completion from history:', error);
  }
}
