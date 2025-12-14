
/**
 * Returns default icon configuration for specific habit names
 */
export function getDefaultIconForHabit(habitName: string): { ios: string; android: string } | null {
  const lowerName = habitName.toLowerCase().trim();
  
  // Drink Water - fancy water bottle
  if (lowerName.includes('water') || lowerName.includes('drink')) {
    return {
      ios: 'waterbottle.fill',
      android: 'water_drop',
    };
  }
  
  // Exercise - dumbbell or running person
  if (lowerName.includes('exercise') || lowerName.includes('workout') || lowerName.includes('gym')) {
    return {
      ios: 'dumbbell.fill',
      android: 'fitness_center',
    };
  }
  
  // Read - open book
  if (lowerName.includes('read') || lowerName.includes('book')) {
    return {
      ios: 'book.pages.fill',
      android: 'menu_book',
    };
  }
  
  // Walk/Run - running person
  if (lowerName.includes('walk') || lowerName.includes('run') || lowerName.includes('jog')) {
    return {
      ios: 'figure.run',
      android: 'directions_run',
    };
  }
  
  // Sleep
  if (lowerName.includes('sleep') || lowerName.includes('rest')) {
    return {
      ios: 'bed.double.fill',
      android: 'bed',
    };
  }
  
  // Meditate
  if (lowerName.includes('meditat') || lowerName.includes('mindful')) {
    return {
      ios: 'leaf.fill',
      android: 'spa',
    };
  }
  
  // Eat healthy
  if (lowerName.includes('eat') || lowerName.includes('food') || lowerName.includes('meal')) {
    return {
      ios: 'fork.knife',
      android: 'restaurant',
    };
  }
  
  // Write/Journal
  if (lowerName.includes('write') || lowerName.includes('journal')) {
    return {
      ios: 'pencil',
      android: 'edit',
    };
  }
  
  return null;
}
