
export const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Believe it. Build it.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

export const wellnessEncouragements = [
  'Great job staying hydrated today! 💧',
  'You\'re crushing your step goal! 🚶',
  'Keep up the amazing work! 🌟',
  'Your wellness journey is inspiring! 💪',
  'Every small step counts! 🎯',
  'You\'re building great habits! 🏆',
  'Your future self will thank you! 🙏',
  'Consistency is key to success! 🔑',
  'You\'re doing amazing! ✨',
  'Keep pushing forward! 🚀',
  'Sleep is your superpower! 😴',
  'Breathe in, breathe out. You\'ve got this! 🧘',
  'Your mood matters. Take care of yourself! 😊',
  'Focus time is quality time! 🎯',
  'Gratitude is the best attitude! 🙏',
];

export function getRandomEncouragement(): string {
  return wellnessEncouragements[Math.floor(Math.random() * wellnessEncouragements.length)];
}
