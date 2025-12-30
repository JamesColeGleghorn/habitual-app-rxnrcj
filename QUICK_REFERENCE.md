
# Quick Reference - iOS Commands

## 🚀 Most Used Commands

```bash
# Start development
npm run ios

# Clear cache and restart
npx expo start --clear

# Build for App Store
npm run build:ios:prod

# Submit to App Store
npm run submit:ios
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Install EAS CLI globally
npm install -g eas-cli

# Login to EAS
eas login

# Initialize EAS project
eas init
```

## 🔨 Development

```bash
# Start on iOS Simulator
npm run ios

# Start on connected iPhone
npm run ios:device

# Start Metro bundler only
npm run start

# Clear Metro cache
npx expo start --clear
```

## 🏗️ Building

```bash
# Development build (with dev client)
npm run build:ios:dev

# Preview build (internal testing)
npm run build:ios:preview

# Production build (App Store)
npm run build:ios:prod

# Check build status
eas build:list
```

## 🧹 Cleaning

```bash
# Clean node_modules
rm -rf node_modules && npm install

# Clean everything
rm -rf node_modules .expo ios android
npm install

# Clear Metro cache
npx expo start --clear

# Clean iOS build (if using Xcode)
cd ios && rm -rf Pods build && pod install && cd ..
```

## 🔍 Debugging

```bash
# Check for issues
npx expo-doctor

# TypeScript check
npx tsc --noEmit

# Lint check
npm run lint

# View logs
npm run ios
# Logs appear in terminal
```

## 📱 Testing

```bash
# Run on simulator
npm run ios

# Run on device
npm run ios:device

# Install specific build
# Download .ipa from EAS
# Drag to Xcode → Window → Devices and Simulators
```

## 🚢 Deployment

```bash
# Build production version
npm run build:ios:prod

# Submit to App Store
npm run submit:ios

# Or manually upload
# Download .ipa from EAS
# Upload via Transporter app
```

## ⚙️ Configuration

```bash
# Configure EAS credentials
eas credentials

# Update app config
# Edit app.json

# Update build config
# Edit eas.json

# Prebuild native project
npx expo prebuild --clean
```

## 🔐 Credentials

```bash
# View credentials
eas credentials

# Remove all credentials
eas credentials
# Select: iOS → Remove all credentials

# Let EAS manage automatically
# Just run: eas build --platform ios
```

## 📊 Monitoring

```bash
# View builds
eas build:list

# View build details
eas build:view [build-id]

# View logs
# Click on build in EAS dashboard
# Or: eas build:view [build-id]
```

## 🆘 Emergency Fixes

```bash
# Complete reset
rm -rf node_modules .expo ios android
npm install
npx expo start --clear

# Fix dependencies
npm install
npx expo install --fix

# Fix TypeScript
npm install --save-dev @types/react@latest

# Fix Metro
npx expo start --clear --reset-cache
```

## 📝 Version Management

```bash
# Update version in app.json
# "version": "1.0.1"
# "buildNumber": "2"

# Then build
npm run build:ios:prod
```

## 🔄 Updates

```bash
# Update Expo
npm install expo@latest

# Update all Expo packages
npx expo install --fix

# Update specific package
npm install [package-name]@latest
```

## 📚 Documentation

```bash
# Open Expo docs
open https://docs.expo.dev

# Open EAS docs
open https://docs.expo.dev/build/introduction/

# Open React Native docs
open https://reactnative.dev
```

## 🎯 Common Workflows

### First Time Setup
```bash
npm install
eas login
eas init
npm run ios
```

### Daily Development
```bash
npm run ios
# Make changes
# Hot reload happens automatically
```

### Before Building
```bash
rm -rf node_modules
npm install
npx expo start --clear
npm run ios
# Test everything works
```

### Building for App Store
```bash
# Update version in app.json
npm run build:ios:prod
# Wait for build
# Download and test
npm run submit:ios
```

### Fixing Errors
```bash
npx expo-doctor
npx tsc --noEmit
npm run lint
# Fix issues
npx expo start --clear
```

## 💡 Tips

- Always test on physical device before submitting
- Keep build logs for reference
- Test in both light and dark mode
- Clear cache when things break
- Update dependencies regularly
- Read error messages carefully
- Check documentation first
- Ask for help if stuck

## 🔗 Quick Links

- **EAS Dashboard**: https://expo.dev
- **App Store Connect**: https://appstoreconnect.apple.com
- **Expo Docs**: https://docs.expo.dev
- **Expo Forums**: https://forums.expo.dev
- **Discord**: https://chat.expo.dev

## 📞 Support

- Check `IOS_TROUBLESHOOTING.md` first
- Search Expo forums
- Ask on Discord
- Create GitHub issue
- Contact Expo support

---

**Pro Tip**: Bookmark this file for quick access to commands!
