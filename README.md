# Al Kautsar Exam Browser - React Native

## Cara Build APK Tanpa Android Studio

### Opsi 1: Build Online dengan Expo EAS (REKOMENDASI - GRATIS)

**Langkah 1: Install Expo CLI**
```bash
npm install -g expo-cli
```

**Langkah 2: Tambahkan expo ke project**
```bash
cd AlKautsarExamBrowserRN
npx install-expo-modules@latest
```

**Langkah 3: Buat file `eas.json`**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

**Langkah 4: Build online**
```bash
npx eas build --platform android --profile preview
```

APK akan ter-build di cloud Expo dan bisa di-download!

---

### Opsi 2: Build dengan GitHub Actions (GRATIS)

**File `.github/workflows/build.yml`:**
```yaml
name: Build React Native APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install dependencies
        run: |
          npm install
          cd android && ./gradlew dependencies

      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: AlKautsarExamBrowser-RN
          path: android/app/build/outputs/apk/release/*.apk
```

---

### Opsi 3: Build di PC (Command Line)

#### Prasyarat:
- Node.js 18+ (https://nodejs.org/)
- Java JDK 17
- Android SDK Command Line Tools

#### Langkah 1: Install dependencies
```bash
cd AlKautsarExamBrowserRN
npm install
```

#### Langkah 2: Install Android SDK
```bash
# Download dari https://developer.android.com/studio#command-tools
# Extract dan set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

sdkmanager --licenses
sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

#### Langkah 3: Build APK
```bash
# Android
npx react-native run-android --variant=release

# Atau langsung
 cd android
./gradlew assembleRelease
```

#### Langkah 4: Sign APK
```bash
# Buat keystore
keytool -genkey -v -keystore alkautsar.keystore -alias alkautsar -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore alkautsar.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk alkautsar

# Align
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk AlKautsarExamBrowser.apk
```

---

## Fitur Keamanan

| Fitur | Status |
|-------|--------|
| Fullscreen lock | OK |
| Block tombol back | OK |
| Anti screenshot (FLAG_SECURE) | OK |
| Anti copy-paste | OK |
| Anti context menu | OK |
| Anti devtools | OK |
| Anti print | OK |
| URL whitelist | OK |
| Lock screen merah | OK |
| Password pengawas: 081511 | OK |
| App state monitoring | OK |

---

## Catatan Penting

Android tidak punya "Assessment Mode" seperti iOS.

- Tombol Home & Recent Apps tidak bisa diblok 100%
- Screenshot bisa di-blur/hitamkan tapi tidak sepenuhnya dicegah
- Untuk keamanan MAKSIMAL, gunakan iPad/iPhone dengan SEB asli

---

## Troubleshooting

### "SDK location not found"
Buat file `android/local.properties`:
```
sdk.dir=/path/to/Android/Sdk
```

### "JAVA_HOME not set"
```bash
export JAVA_HOME=/path/to/jdk-17
```

### "Metro bundler not running"
```bash
npx react-native start
```

---

Al Kautsar Karawang - Extraordinary CBT
