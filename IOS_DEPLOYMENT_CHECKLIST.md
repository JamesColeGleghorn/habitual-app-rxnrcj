
# iOS Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All features tested and working
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] ESLint passes: `npm run lint`
- [ ] All imports resolve correctly
- [ ] No unused dependencies

### Configuration
- [ ] `app.json` - Bundle identifier is unique
- [ ] `app.json` - App name is correct
- [ ] `app.json` - Version and build number updated
- [ ] `app.json` - All required permissions added
- [ ] `eas.json` - Build profiles configured
- [ ] Environment variables set (if needed)

### Assets
- [ ] App icon (1024x1024 PNG)
- [ ] Splash screen
- [ ] All images optimized
- [ ] No missing assets

### Testing
- [ ] Tested on iOS Simulator
- [ ] Tested on physical iPhone
- [ ] Tested on iPad (if supporting)
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Tested all user flows
- [ ] Tested offline functionality
- [ ] Tested notifications
- [ ] Tested permissions

## Build Process

### 1. Clean Install
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### 2. Test Locally
```bash
npm run ios
```
Verify everything works.

### 3. Build with EAS

#### Development Build
```bash
npm run build:ios:dev
```

#### Preview Build
```bash
npm run build:ios:preview
```

#### Production Build
```bash
npm run build:ios:prod
```

### 4. Monitor Build
- Check build status at: https://expo.dev
- Review build logs for any warnings
- Download build when complete

### 5. Test Build
- [ ] Install on test device
- [ ] Test all features
- [ ] Verify no crashes
- [ ] Check performance
- [ ] Test on multiple devices

## App Store Submission

### 1. App Store Connect Setup
- [ ] Create app in App Store Connect
- [ ] Set app name
- [ ] Choose category
- [ ] Set age rating
- [ ] Add app description
- [ ] Add keywords
- [ ] Set pricing

### 2. Screenshots
Required sizes:
- [ ] 6.7" (iPhone 14 Pro Max): 1290 x 2796
- [ ] 6.5" (iPhone 11 Pro Max): 1242 x 2688
- [ ] 5.5" (iPhone 8 Plus): 1242 x 2208
- [ ] 12.9" iPad Pro (if supporting): 2048 x 2732

### 3. App Information
- [ ] App name (30 characters max)
- [ ] Subtitle (30 characters max)
- [ ] Description (4000 characters max)
- [ ] Keywords (100 characters max)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Privacy policy URL

### 4. Build Upload
```bash
npm run submit:ios
```

Or manually:
1. Download .ipa from EAS
2. Upload via Xcode or Transporter app
3. Wait for processing (can take 30+ minutes)

### 5. TestFlight (Optional)
- [ ] Add internal testers
- [ ] Add external testers
- [ ] Collect feedback
- [ ] Fix any issues
- [ ] Submit new build if needed

### 6. Submit for Review
- [ ] Select build
- [ ] Add version information
- [ ] Add release notes
- [ ] Choose release method (manual/automatic)
- [ ] Submit for review

### 7. Review Process
- Average review time: 24-48 hours
- Check status in App Store Connect
- Respond to any reviewer questions
- Fix any rejection issues

## Post-Submission

### If Approved
- [ ] App goes live (or scheduled release)
- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Respond to user feedback
- [ ] Plan updates

### If Rejected
- [ ] Read rejection reason carefully
- [ ] Fix the issues
- [ ] Test thoroughly
- [ ] Resubmit

## Maintenance

### Regular Updates
- [ ] Fix bugs reported by users
- [ ] Add new features
- [ ] Update dependencies
- [ ] Improve performance
- [ ] Update for new iOS versions

### Monitoring
- [ ] Check App Store Connect analytics
- [ ] Monitor crash reports
- [ ] Read user reviews
- [ ] Track app performance
- [ ] Monitor download numbers

### Version Updates
When releasing updates:
1. Update version in `app.json`
2. Update build number
3. Build new version
4. Test thoroughly
5. Submit to App Store
6. Add release notes

## Emergency Fixes

If critical bug found:
1. Fix immediately
2. Test fix thoroughly
3. Increment build number
4. Build and submit
5. Request expedited review (if critical)

## Useful Links

- **App Store Connect**: https://appstoreconnect.apple.com
- **EAS Dashboard**: https://expo.dev
- **Apple Developer**: https://developer.apple.com
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/

## Support Contacts

- **Expo Support**: https://expo.dev/support
- **Apple Developer Support**: https://developer.apple.com/support/
- **App Store Review**: https://developer.apple.com/contact/app-store/

## Notes

- Keep all build logs
- Document any issues and solutions
- Maintain changelog
- Keep backup of all builds
- Save all screenshots and assets
