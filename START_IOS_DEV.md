
# Quick Start Guide - iOS Development

## First Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run ios
```

This will:
- Start the Metro bundler
- Open iOS Simulator
- Load the app

## Daily Development Workflow

### Start the app
```bash
npm run ios
```

### Clear cache if needed
```bash
npx expo start --clear
```

### Run on physical device
```bash
npm run ios:device
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run ios` | Start on iOS Simulator |
| `npm run ios:device` | Start on connected iOS device |
| `npm run start` | Start Metro bundler only |
| `npm run prebuild:ios` | Generate native iOS project |
| `npm run build:ios:dev` | Build development version with EAS |
| `npm run build:ios:preview` | Build preview version with EAS |
| `npm run build:ios:prod` | Build production version with EAS |

## Debugging

### View Logs
- In Simulator: Cmd + D → "Debug"
- In Terminal: Logs appear automatically

### Reload App
- In Simulator: Cmd + R
- Shake device: Opens dev menu

### Clear Everything
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

## File Structure

```
app/
├── (tabs)/
│   ├── (home)/
│   │   ├── index.ios.tsx       # iOS-specific home screen
│   │   ├── dashboard.tsx       # Wellness dashboard
│   │   ├── insights.tsx        # Weekly insights
│   │   └── code-completion.tsx # Code completion tool
│   ├── _layout.ios.tsx         # iOS native tabs
│   └── profile.ios.tsx         # iOS-specific profile
├── _layout.tsx                 # Root layout
└── modal.tsx                   # Add habit modal

components/                     # Reusable UI components
hooks/                         # Custom React hooks
utils/                         # Utility functions
styles/                        # Shared styles
types/                         # TypeScript types
```

## Features

### ✅ Habit Tracking
- Create custom habits
- Track daily completion
- View streaks and stats

### ✅ Wellness Dashboard
- Step tracking (pedometer)
- Water intake
- Sleep logging
- Mood tracking
- Pomodoro timer

### ✅ Insights
- Weekly trends
- Mood vs sleep correlation
- Progress charts

### ✅ Code Completion
- AI-powered suggestions
- Multiple language support
- OpenRouter integration

## Need Help?

1. Check `IOS_BUILD_GUIDE.md` for detailed build instructions
2. Check `README.md` for general app information
3. Visit https://docs.expo.dev for Expo documentation
