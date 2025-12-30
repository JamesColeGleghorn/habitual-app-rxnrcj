
# iOS Build Guide for Habitual App

## Prerequisites

1. **macOS Computer** - Required for iOS development
2. **Xcode** - Install from Mac App Store (latest version)
3. **Apple Developer Account** - Required for device testing and App Store deployment
4. **EAS CLI** - Install globally: `npm install -g eas-cli`
5. **Expo Account** - Sign up at https://expo.dev

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Login to EAS
```bash
eas login
```

### 3. Configure EAS Project
```bash
eas init
```
This will create a project ID and update your app.json

### 4. Update eas.json
Replace the placeholder values in `eas.json` submit section:
- `appleId`: Your Apple ID email
- `ascAppId`: Your App Store Connect App ID
- `appleTeamId`: Your Apple Developer Team ID

## Building for iOS

### Development Build (for testing on simulator/device)
```bash
npm run build:ios:dev
```
This creates a development build that includes the Expo dev client.

### Preview Build (for internal testing)
```bash
npm run build:ios:preview
```
This creates a production-like build for internal distribution.

### Production Build (for App Store)
```bash
npm run build:ios:prod
```
This creates the final build for App Store submission.

## Running on iOS

### Simulator
```bash
npm run ios
```

### Physical Device
```bash
npm run ios:device
```

## Troubleshooting Common Issues

### 1. "No provisioning profile found"
**Solution**: 
- Log into your Apple Developer account
- Run: `eas credentials`
- Select "iOS" → "Set up ad hoc provisioning profile"

### 2. "Bundle identifier already exists"
**Solution**: 
- Change `bundleIdentifier` in `app.json` to something unique
- Format: `com.yourcompany.appname`

### 3. "Build failed with code signing error"
**Solution**:
- Run: `eas credentials`
- Select "iOS" → "Remove all credentials"
- Rebuild and let EAS manage credentials automatically

### 4. "Module not found" errors
**Solution**:
```bash
rm -rf node_modules
npm install
npx expo prebuild --clean
```

### 5. "Expo Router not working"
**Solution**:
- Ensure `index.ts` contains only: `import 'expo-router/entry';`
- Clear Metro cache: `npx expo start --clear`

### 6. "Notifications not working"
**Solution**:
- Ensure you're testing on a physical device (not simulator)
- Check that notification permissions are granted in Settings
- Verify `expo-notifications` plugin is in `app.json`

### 7. "Pedometer/Sensors not working"
**Solution**:
- Test on a physical device (sensors don't work in simulator)
- Check that motion permissions are granted
- Verify `NSMotionUsageDescription` is in `app.json`

## App Store Submission

### 1. Create App in App Store Connect
- Go to https://appstoreconnect.apple.com
- Create a new app
- Note the App ID for `eas.json`

### 2. Build Production Version
```bash
npm run build:ios:prod
```

### 3. Submit to App Store
```bash
npm run submit:ios
```

### 4. Fill Out App Information
- Screenshots (required sizes: 6.5", 5.5")
- App description
- Keywords
- Privacy policy URL
- Support URL

## Testing Checklist

Before submitting to App Store, test:

- [ ] All habit tracking features work
- [ ] Notifications are received
- [ ] Pedometer tracks steps correctly
- [ ] Image picker works for custom icons
- [ ] App works in both light and dark mode
- [ ] Navigation between tabs works smoothly
- [ ] Data persists after app restart
- [ ] App works on different iPhone models
- [ ] App works on iPad (if supporting tablets)

## Performance Optimization

### Reduce App Size
```bash
# Remove unused dependencies
npm prune

# Optimize images
# Use smaller image sizes in assets/images/
```

### Improve Launch Time
- Minimize work in `_layout.tsx`
- Use lazy loading for heavy components
- Optimize AsyncStorage reads

## Support

For issues specific to:
- **Expo**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **React Native**: https://reactnative.dev/docs/getting-started

## Build Status

Check your build status at: https://expo.dev/accounts/[your-account]/projects/habitual/builds
