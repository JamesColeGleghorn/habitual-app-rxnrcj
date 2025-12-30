
# iOS Setup Summary - Habitual App

## 🎯 Quick Start

Your app is now configured for iOS-only deployment. Here's what you need to do:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development
```bash
npm run ios
```

### 3. Build for Production
```bash
# First time: Login to EAS
eas login

# Initialize project
eas init

# Build
npm run build:ios:prod
```

## 📁 What Changed

### Updated Files
1. **app.json** - iOS-only configuration with proper permissions
2. **eas.json** - iOS build profiles (development, preview, production)
3. **package.json** - Removed Android/Web dependencies, added iOS scripts
4. **metro.config.js** - Optimized for iOS platform-specific files
5. **babel.config.js** - Proper module resolution for iOS
6. **tsconfig.json** - TypeScript configuration for iOS

### New Documentation
1. **IOS_BUILD_GUIDE.md** - Complete build instructions
2. **IOS_TROUBLESHOOTING.md** - Solutions to common errors
3. **IOS_PREBUILD_CHECKLIST.md** - Pre-build verification
4. **IOS_DEPLOYMENT_CHECKLIST.md** - App Store submission guide
5. **START_IOS_DEV.md** - Quick daily development guide

## 🔧 Configuration Highlights

### App Configuration (app.json)
- **Bundle ID**: `com.habitual.app` (change this to your own)
- **Platform**: iOS only
- **Permissions**: Motion, Camera, Photo Library, Notifications
- **Plugins**: Notifications, Image Picker, Sensors

### Build Profiles (eas.json)
- **Development**: For testing with Expo Go
- **Preview**: For internal testing
- **Production**: For App Store submission

## 📱 Features Configured

### ✅ Core Features
- Habit tracking with streaks
- Custom habit icons (camera/photo library)
- Push notifications
- Data persistence (AsyncStorage)
- Light/Dark mode support

### ✅ Wellness Dashboard
- Step tracking (pedometer)
- Water intake tracking
- Sleep logging
- Mood tracking
- Pomodoro timer

### ✅ Additional Features
- Weekly insights
- Progress charts
- Code completion tool (with Supabase)
- Motivational quotes

## 🚀 Development Workflow

### Daily Development
```bash
# Start development server
npm run ios

# Clear cache if needed
npx expo start --clear

# Run on physical device
npm run ios:device
```

### Building
```bash
# Development build (with dev client)
npm run build:ios:dev

# Preview build (internal testing)
npm run build:ios:preview

# Production build (App Store)
npm run build:ios:prod
```

### Submitting
```bash
# Submit to App Store
npm run submit:ios
```

## ⚠️ Important Notes

### Before Building
1. **Change Bundle Identifier** in `app.json`:
   ```json
   "bundleIdentifier": "com.yourcompany.yourapp"
   ```

2. **Update App Name** if desired:
   ```json
   "name": "Your App Name"
   ```

3. **Configure EAS** (for production):
   - Update `eas.json` with your Apple ID
   - Add your Team ID
   - Add your App Store Connect App ID

### Testing Requirements
- **Simulator**: Most features work
- **Physical Device Required For**:
  - Pedometer/step tracking
  - Push notifications
  - Camera
  - Motion sensors

### Permissions
The app requests these permissions:
- **Motion**: For step tracking
- **Camera**: For custom habit photos
- **Photo Library**: For selecting habit icons
- **Notifications**: For habit reminders

## 🐛 Common Issues

### "Module not found"
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### "Build failed"
1. Check `IOS_TROUBLESHOOTING.md`
2. Verify bundle identifier is unique
3. Check EAS build logs

### "Notifications not working"
- Test on physical device (not simulator)
- Check iOS Settings → Habitual → Notifications

### "Pedometer not working"
- Test on physical device (not simulator)
- Check iOS Settings → Privacy → Motion & Fitness

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `IOS_BUILD_GUIDE.md` | Complete build instructions |
| `IOS_TROUBLESHOOTING.md` | Error solutions |
| `IOS_PREBUILD_CHECKLIST.md` | Pre-build verification |
| `IOS_DEPLOYMENT_CHECKLIST.md` | App Store submission |
| `START_IOS_DEV.md` | Quick start guide |

## 🎨 Customization

### Colors
Edit `styles/commonStyles.ts`:
```typescript
export const colors = {
  primary: '#29ABE2',
  secondary: '#FF6B6B',
  // ... more colors
};
```

### Habits
Default habits are in `utils/habitStorage.ts`

### Notifications
Configure in `utils/notificationManager.ts`

## 📊 Project Structure

```
habitual-app/
├── app/
│   ├── (tabs)/
│   │   ├── (home)/
│   │   │   ├── index.ios.tsx       # Home screen
│   │   │   ├── dashboard.tsx       # Wellness
│   │   │   ├── insights.tsx        # Insights
│   │   │   └── code-completion.tsx # Code tool
│   │   ├── _layout.ios.tsx         # iOS tabs
│   │   └── profile.ios.tsx         # Profile
│   └── _layout.tsx                 # Root layout
├── components/                     # UI components
├── hooks/                         # Custom hooks
├── utils/                         # Utilities
├── styles/                        # Styles
├── types/                         # TypeScript types
├── app.json                       # App config
├── eas.json                       # Build config
└── package.json                   # Dependencies
```

## 🔐 Security

### API Keys
If using Supabase or OpenRouter:
1. Never commit API keys
2. Use environment variables
3. Store in EAS Secrets for builds

### Data Privacy
- All data stored locally (AsyncStorage)
- No data sent to external servers (except code completion if enabled)
- User controls all data

## 📈 Next Steps

### 1. Customize
- Change bundle identifier
- Update app name
- Customize colors
- Add your own features

### 2. Test
- Test on iOS Simulator
- Test on physical iPhone
- Test all features
- Fix any bugs

### 3. Build
- Build development version
- Test on device
- Build production version
- Test again

### 4. Submit
- Create app in App Store Connect
- Prepare screenshots
- Write description
- Submit for review

## 🆘 Need Help?

### Resources
- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **React Native**: https://reactnative.dev

### Support
- **Expo Forums**: https://forums.expo.dev
- **Discord**: https://chat.expo.dev
- **GitHub**: https://github.com/expo/expo/issues

### Troubleshooting
1. Check `IOS_TROUBLESHOOTING.md`
2. Search Expo forums
3. Check GitHub issues
4. Ask on Discord

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] App runs on simulator
- [ ] App runs on device
- [ ] All features tested
- [ ] Bundle identifier changed
- [ ] EAS configured
- [ ] Build successful
- [ ] App Store Connect ready
- [ ] Screenshots prepared
- [ ] Submitted for review

## 🎉 You're Ready!

Your app is now configured for iOS deployment. Follow the guides in order:

1. **START_IOS_DEV.md** - Start developing
2. **IOS_PREBUILD_CHECKLIST.md** - Before building
3. **IOS_BUILD_GUIDE.md** - Build the app
4. **IOS_DEPLOYMENT_CHECKLIST.md** - Submit to App Store

Good luck with your app! 🚀
