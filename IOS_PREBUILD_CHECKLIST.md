
# iOS Pre-Build Checklist

Before building your iOS app, ensure all these items are completed:

## ✅ Configuration Files

- [ ] `app.json` - Bundle identifier is unique (format: `com.yourcompany.appname`)
- [ ] `app.json` - App name is set correctly
- [ ] `app.json` - iOS version and build number are set
- [ ] `eas.json` - Apple ID, Team ID, and ASC App ID are configured (for production)
- [ ] `package.json` - All dependencies are installed (`npm install`)

## ✅ Assets

- [ ] App icon exists at `./assets/images/natively-dark.png`
- [ ] App icon is at least 1024x1024 pixels
- [ ] Splash screen image exists
- [ ] All custom images are optimized (< 1MB each)

## ✅ Permissions

Verify these permissions are in `app.json` → `ios.infoPlist`:

- [ ] `NSMotionUsageDescription` - For pedometer/step tracking
- [ ] `NSPhotoLibraryUsageDescription` - For custom habit icons
- [ ] `NSCameraUsageDescription` - For taking photos
- [ ] `UIBackgroundModes` - For notifications

## ✅ Features

Test these features work correctly:

- [ ] Habit creation and tracking
- [ ] Pedometer/step counting (physical device only)
- [ ] Image picker for custom icons
- [ ] Notifications (physical device only)
- [ ] Data persistence (AsyncStorage)
- [ ] Navigation between screens
- [ ] Light and dark mode
- [ ] Code completion tool (if using Supabase)

## ✅ Code Quality

- [ ] No console errors in development
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All imports resolve correctly
- [ ] No unused dependencies

## ✅ Testing

- [ ] App runs on iOS Simulator
- [ ] App runs on physical iOS device
- [ ] All screens are accessible
- [ ] Data persists after app restart
- [ ] App works on different iPhone models
- [ ] App works on iPad (if supporting tablets)

## ✅ Performance

- [ ] App launches in < 3 seconds
- [ ] No memory leaks
- [ ] Smooth animations (60 FPS)
- [ ] No lag when scrolling
- [ ] Images load quickly

## ✅ Build Preparation

- [ ] Clean install: `rm -rf node_modules && npm install`
- [ ] Clear cache: `npx expo start --clear`
- [ ] Test build locally: `npm run ios`
- [ ] Verify all features work after clean install

## ✅ EAS Build (if using EAS)

- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into EAS: `eas login`
- [ ] Project initialized: `eas init`
- [ ] Credentials configured: `eas credentials`

## ✅ App Store Preparation (Production Only)

- [ ] App created in App Store Connect
- [ ] App Store screenshots prepared (6.5" and 5.5" sizes)
- [ ] App description written
- [ ] Keywords selected
- [ ] Privacy policy URL ready
- [ ] Support URL ready
- [ ] Age rating determined
- [ ] Pricing and availability set

## Build Commands

### Development Build
```bash
npm run build:ios:dev
```

### Preview Build
```bash
npm run build:ios:preview
```

### Production Build
```bash
npm run build:ios:prod
```

## After Build

- [ ] Download and test the build
- [ ] Verify all features work in the build
- [ ] Test on multiple devices if possible
- [ ] Submit to TestFlight for beta testing (optional)
- [ ] Submit to App Store when ready

## Common Issues

### Build Fails
1. Check EAS build logs for specific errors
2. Verify all dependencies are compatible with iOS
3. Ensure bundle identifier is unique
4. Check that all required permissions are in app.json

### App Crashes on Launch
1. Check for missing native dependencies
2. Verify all plugins are properly configured
3. Test on a clean iOS Simulator
4. Check Metro bundler logs for errors

### Features Not Working
1. Verify permissions are granted in iOS Settings
2. Test on physical device (some features don't work in simulator)
3. Check AsyncStorage for data persistence issues
4. Verify API keys and environment variables are set

## Need Help?

- Expo Documentation: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- React Native iOS: https://reactnative.dev/docs/running-on-device
