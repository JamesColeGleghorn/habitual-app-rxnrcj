
# iOS Deployment Troubleshooting Guide

## Common Build Errors and Solutions

### 1. "No Bundle Identifier Found"

**Error Message:**
```
Error: No bundle identifier found in app.json
```

**Solution:**
Update `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.habitual"
    }
  }
}
```

---

### 2. "Provisioning Profile Error"

**Error Message:**
```
Error: No provisioning profile found
```

**Solution:**
```bash
# Let EAS manage credentials automatically
eas build --platform ios --profile development

# Or manually configure
eas credentials
# Select: iOS → Set up ad hoc provisioning profile
```

---

### 3. "Module Not Found" Errors

**Error Message:**
```
Error: Unable to resolve module @/components/...
```

**Solution:**
```bash
# Clean install
rm -rf node_modules
rm -rf .expo
npm install

# Clear Metro cache
npx expo start --clear

# Rebuild
npm run ios
```

---

### 4. "Duplicate Symbols" Error

**Error Message:**
```
Error: Duplicate symbols for architecture arm64
```

**Solution:**
```bash
# Clean iOS build
cd ios
rm -rf Pods
rm -rf build
rm Podfile.lock
pod install
cd ..

# Or use Expo prebuild
npx expo prebuild --clean
```

---

### 5. "React Native Reanimated" Error

**Error Message:**
```
Error: Reanimated 2 failed to create a worklet
```

**Solution:**
Ensure `babel.config.js` has reanimated plugin as the LAST plugin:
```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // ... other plugins
    'react-native-reanimated/plugin', // MUST be last
  ],
};
```

Then:
```bash
npx expo start --clear
```

---

### 6. "Expo Router Not Working"

**Error Message:**
```
Error: Couldn't find a navigation object
```

**Solution:**
1. Verify `index.ts` contains only:
```typescript
import 'expo-router/entry';
```

2. Check `app.json` has expo-router plugin:
```json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

3. Clear cache:
```bash
npx expo start --clear
```

---

### 7. "AsyncStorage Not Working"

**Error Message:**
```
Error: AsyncStorage is null
```

**Solution:**
```bash
# Reinstall AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage

# Rebuild
npx expo prebuild --clean
npm run ios
```

---

### 8. "Notifications Not Working"

**Error Message:**
```
Notifications not appearing on device
```

**Solution:**
1. Test on physical device (not simulator)
2. Check permissions in iOS Settings → Habitual → Notifications
3. Verify `app.json` has notification plugin:
```json
{
  "expo": {
    "plugins": [
      ["expo-notifications", {
        "icon": "./assets/images/natively-dark.png",
        "color": "#29ABE2"
      }]
    ]
  }
}
```

---

### 9. "Pedometer/Sensors Not Working"

**Error Message:**
```
Pedometer is not available on this device
```

**Solution:**
1. Test on physical device (sensors don't work in simulator)
2. Check motion permissions in iOS Settings
3. Verify `app.json` has permission:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSMotionUsageDescription": "This app uses motion data to track your daily steps."
      }
    }
  }
}
```

---

### 10. "Image Picker Not Working"

**Error Message:**
```
Error: Missing camera or photo library permissions
```

**Solution:**
1. Check `app.json` has permissions:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Access photos for custom habit icons.",
        "NSCameraUsageDescription": "Take photos for custom habit icons."
      }
    },
    "plugins": [
      ["expo-image-picker", {
        "photosPermission": "Access photos for custom habit icons.",
        "cameraPermission": "Take photos for custom habit icons."
      }]
    ]
  }
}
```

2. Rebuild:
```bash
npx expo prebuild --clean
npm run ios
```

---

### 11. "Build Takes Too Long"

**Issue:**
EAS build is taking over 30 minutes

**Solution:**
1. Remove unused dependencies:
```bash
npm prune
```

2. Optimize images (reduce file sizes)

3. Use caching in `eas.json`:
```json
{
  "build": {
    "production": {
      "ios": {
        "cache": {
          "key": "v1",
          "paths": ["node_modules"]
        }
      }
    }
  }
}
```

---

### 12. "App Crashes on Launch"

**Issue:**
App crashes immediately after opening

**Solution:**
1. Check EAS build logs for errors
2. Test on iOS Simulator first:
```bash
npm run ios
```

3. Check for missing native dependencies:
```bash
npx expo-doctor
```

4. Verify all imports are correct:
```bash
npx tsc --noEmit
```

---

### 13. "Dark Mode Not Working"

**Issue:**
App doesn't switch between light and dark mode

**Solution:**
1. Verify `app.json` has:
```json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```

2. Check `useThemeColors` hook is used in all screens

3. Test by changing iOS Settings → Display & Brightness

---

### 14. "Navigation Not Working"

**Issue:**
Can't navigate between screens

**Solution:**
1. Check file structure matches routes:
```
app/
├── (tabs)/
│   ├── (home)/
│   │   └── index.ios.tsx
│   └── profile.ios.tsx
```

2. Verify `_layout.ios.tsx` exists for iOS

3. Clear Metro cache:
```bash
npx expo start --clear
```

---

### 15. "Supabase Connection Error"

**Error Message:**
```
Error: Failed to connect to Supabase
```

**Solution:**
1. Verify environment variables are set
2. Check Supabase URL and anon key in code
3. Test connection:
```typescript
import { supabase } from '@/app/integrations/supabase/client';

const testConnection = async () => {
  const { data, error } = await supabase.from('test').select('*').limit(1);
  console.log('Connection test:', { data, error });
};
```

---

## General Debugging Steps

### 1. Clean Everything
```bash
# Remove all build artifacts
rm -rf node_modules
rm -rf .expo
rm -rf ios
rm -rf android

# Reinstall
npm install

# Clear cache
npx expo start --clear
```

### 2. Check Dependencies
```bash
# Check for issues
npx expo-doctor

# Update Expo
npm install expo@latest

# Update all Expo packages
npx expo install --fix
```

### 3. Verify Configuration
```bash
# Check app.json syntax
cat app.json | python -m json.tool

# Check TypeScript
npx tsc --noEmit

# Check ESLint
npm run lint
```

### 4. Test Incrementally
1. Start with a minimal app
2. Add features one by one
3. Test after each addition
4. Identify which feature causes issues

### 5. Check Logs
```bash
# Metro bundler logs
npm run ios

# EAS build logs
eas build:list
# Click on build → View logs

# iOS device logs
# Xcode → Window → Devices and Simulators → Select device → View logs
```

---

## Still Having Issues?

### Get Help
1. **Expo Forums**: https://forums.expo.dev
2. **Discord**: https://chat.expo.dev
3. **GitHub Issues**: https://github.com/expo/expo/issues
4. **Stack Overflow**: Tag with `expo` and `react-native`

### Provide Information
When asking for help, include:
- Expo SDK version
- iOS version
- Device model
- Full error message
- Steps to reproduce
- Relevant code snippets
- Build logs (if using EAS)

### Create Minimal Reproduction
1. Create a new Expo project
2. Add only the code that causes the issue
3. Share the repository
4. This helps others debug faster
