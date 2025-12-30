
# Habitual - iOS Habit Tracking App

A beautiful, minimalistic habit tracking app for iOS with wellness features, built with React Native and Expo.

## ✨ Features

- **Habit Tracking** - Track 3-5 key habits daily with visual streaks
- **Wellness Dashboard** - Monitor steps, water intake, sleep, mood, and focus time
- **Weekly Insights** - View trends and correlations (e.g., mood vs sleep)
- **Custom Icons** - Use photos or default icons for habits
- **Push Notifications** - Gentle reminders for habits and wellness activities
- **Progress Stats** - Track completion rates, streaks, and achievements
- **Code Completion** - AI-powered code suggestions (optional feature)
- **Light/Dark Mode** - Automatic theme switching

## 🚀 Quick Start

### Prerequisites
- macOS computer
- Xcode (latest version)
- Node.js 18+ and npm
- Apple Developer account (for device testing and App Store)

### Installation

```bash
# Install dependencies
npm install

# Start development
npm run ios
```

That's it! The app will open in iOS Simulator.

## 📱 Development

### Daily Development
```bash
npm run ios              # Start on simulator
npm run ios:device       # Start on connected iPhone
npx expo start --clear   # Clear cache if needed
```

### Building
```bash
npm run build:ios:dev      # Development build
npm run build:ios:preview  # Preview build
npm run build:ios:prod     # Production build
```

### Submitting
```bash
npm run submit:ios         # Submit to App Store
```

## 📚 Documentation

Comprehensive guides are available:

- **[START_IOS_DEV.md](START_IOS_DEV.md)** - Quick start for daily development
- **[IOS_BUILD_GUIDE.md](IOS_BUILD_GUIDE.md)** - Complete build instructions
- **[IOS_TROUBLESHOOTING.md](IOS_TROUBLESHOOTING.md)** - Solutions to common errors
- **[IOS_PREBUILD_CHECKLIST.md](IOS_PREBUILD_CHECKLIST.md)** - Pre-build verification
- **[IOS_DEPLOYMENT_CHECKLIST.md](IOS_DEPLOYMENT_CHECKLIST.md)** - App Store submission
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command reference
- **[IOS_SETUP_SUMMARY.md](IOS_SETUP_SUMMARY.md)** - Configuration overview
- **[CHANGES_EXPLAINED.md](CHANGES_EXPLAINED.md)** - What changed and why

## 🎯 Project Structure

```
habitual-app/
├── app/
│   ├── (tabs)/
│   │   ├── (home)/
│   │   │   ├── index.ios.tsx       # Home screen
│   │   │   ├── dashboard.tsx       # Wellness dashboard
│   │   │   ├── insights.tsx        # Weekly insights
│   │   │   └── code-completion.tsx # Code completion tool
│   │   ├── _layout.ios.tsx         # iOS native tabs
│   │   └── profile.ios.tsx         # Progress & stats
│   ├── _layout.tsx                 # Root layout
│   └── modal.tsx                   # Add habit modal
├── components/                     # Reusable UI components
├── hooks/                         # Custom React hooks
├── utils/                         # Utility functions
├── styles/                        # Shared styles
├── types/                         # TypeScript types
└── assets/                        # Images and fonts
```

## 🔧 Configuration

### Before Building

1. **Update Bundle Identifier** in `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    }
  }
}
```

2. **Update App Name** (optional):
```json
{
  "expo": {
    "name": "Your App Name"
  }
}
```

3. **Configure EAS** (for production):
```bash
eas login
eas init
```

## 🎨 Customization

### Colors
Edit `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#29ABE2',
  secondary: '#FF6B6B',
  accent: '#4ECDC4',
  // ... more colors
};
```

### Default Habits
Edit `utils/habitStorage.ts` to change default habits.

### Notifications
Configure in `utils/notificationManager.ts`.

## 🧪 Testing

### Simulator
```bash
npm run ios
```

### Physical Device
```bash
npm run ios:device
```

**Note:** Some features require a physical device:
- Pedometer/step tracking
- Push notifications
- Camera
- Motion sensors

## 🐛 Troubleshooting

### Common Issues

**Module not found:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

**Build failed:**
- Check `IOS_TROUBLESHOOTING.md`
- Verify bundle identifier is unique
- Check EAS build logs

**Notifications not working:**
- Test on physical device (not simulator)
- Check iOS Settings → Habitual → Notifications

**Pedometer not working:**
- Test on physical device (not simulator)
- Check iOS Settings → Privacy → Motion & Fitness

For more solutions, see [IOS_TROUBLESHOOTING.md](IOS_TROUBLESHOOTING.md).

## 📦 Dependencies

### Core
- **expo** ~54.0.1 - Development framework
- **react-native** 0.81.4 - Mobile framework
- **expo-router** ^6.0.0 - File-based routing

### Features
- **@react-native-async-storage/async-storage** - Data persistence
- **expo-notifications** - Push notifications
- **expo-sensors** - Pedometer/step tracking
- **expo-image-picker** - Camera/photo library
- **react-native-svg** - Graphics and charts
- **@supabase/supabase-js** - Backend (optional)

## 🚢 Deployment

### App Store Submission

1. **Build production version:**
```bash
npm run build:ios:prod
```

2. **Submit to App Store:**
```bash
npm run submit:ios
```

3. **Or manually:**
- Download .ipa from EAS
- Upload via Transporter app
- Submit in App Store Connect

For detailed instructions, see [IOS_DEPLOYMENT_CHECKLIST.md](IOS_DEPLOYMENT_CHECKLIST.md).

## 📊 Features Breakdown

### Habit Tracking
- Create custom habits with names, icons, and colors
- Track daily completion with checkboxes
- View current and longest streaks
- See completion rates and statistics
- Custom photos or default icons

### Wellness Dashboard
- **Steps:** Automatic tracking via device pedometer
- **Water:** Manual tracking with goal setting
- **Sleep:** Log bedtime and wake time with score
- **Mood:** Quick emoji selector with optional notes
- **Focus:** Built-in 25-minute Pomodoro timer

### Daily Wins
- Gratitude journal (3 entries)
- Guided breathing exercises
- Posture/movement reminders

### Insights
- Weekly trends and charts
- Mood vs sleep correlation
- Progress visualization
- Habit completion patterns

### Code Completion (Optional)
- AI-powered code suggestions
- Multiple programming languages
- OpenRouter integration
- Syntax highlighting

## 🔐 Privacy & Data

- All data stored locally on device (AsyncStorage)
- No data sent to external servers (except code completion if enabled)
- User has full control over their data
- No tracking or analytics
- Camera/photo access only when user chooses

## 🆘 Support

### Documentation
- Check the guides in this repository
- Read [IOS_TROUBLESHOOTING.md](IOS_TROUBLESHOOTING.md) for common issues

### Community
- **Expo Forums:** https://forums.expo.dev
- **Discord:** https://chat.expo.dev
- **GitHub Issues:** https://github.com/expo/expo/issues

### Resources
- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [Supabase](https://supabase.com) (optional)

## 📞 Contact

For support or questions, please refer to the documentation files or reach out via the Expo community channels.

---

**Ready to build your habit tracking app?** Start with [START_IOS_DEV.md](START_IOS_DEV.md)! 🚀
