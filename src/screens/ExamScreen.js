import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  AppState,
  BackHandler,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import SecurityOverlay from '../components/SecurityOverlay';

const EXAM_URL = 'https://ujiancbt.alkautsarkrw.web.id';
const ADMIN_PASSWORD = '081511';

const ExamScreen = () => {
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const appState = useRef(AppState.currentState);
  const securityTimer = useRef(null);

  // ===== ANTI-CHEATING JAVASCRIPT =====
  const antiCheatScript = `
    (function() {
      if (window.__alkautsar_security__) return;
      window.__alkautsar_security__ = true;

      // Block copy, cut, paste
      ['copy','cut','paste'].forEach(function(evt) {
        document.addEventListener(evt, function(e) { 
          e.preventDefault(); 
          e.stopPropagation();
          return false;
        }, true);
      });

      // Block context menu
      document.addEventListener('contextmenu', function(e) { 
        e.preventDefault(); 
        e.stopPropagation();
        return false;
      }, true);

      // Block text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';

      // Block drag
      document.addEventListener('dragstart', function(e) { 
        e.preventDefault(); 
        return false;
      }, true);

      // Block print
      window.print = function() { 
        alert('Print dinonaktifkan selama ujian!'); 
      };

      // Detect devtools
      var devtoolsOpen = false;
      setInterval(function() {
        var threshold = 200;
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > threshold || heightDiff > threshold) {
          if (!devtoolsOpen) {
            devtoolsOpen = true;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'VIOLATION',
              violationType: 'DEVTOOLS_OPEN'
            }));
          }
        } else {
          devtoolsOpen = false;
        }
      }, 1000);

      // Clear clipboard periodically
      if (navigator.clipboard && navigator.clipboard.writeText) {
        setInterval(function() {
          navigator.clipboard.writeText('').catch(function(){});
        }, 500);
      }

      // Block keyboard shortcuts
      document.addEventListener('keydown', function(e) {
        var blocked = [112,113,114,115,116,117,118,119,120,121,122,123,44];
        if (blocked.indexOf(e.keyCode) !== -1 || 
            (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 'p' || e.key === 's' || e.key === 'u')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c'))) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);

      // Detect visibility change
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'VIOLATION',
            violationType: 'TAB_HIDDEN'
          }));
        }
      });

      console.log('Al Kautsar Security: Active');
    })();
    true;
  `;

  // ===== URL FILTER =====
  const isAllowedUrl = (url) => {
    const allowedDomains = [
      'ujiancbt.alkautsarkrw.web.id',
      'alkautsarkrw.web.id',
      'google.com',
      'gstatic.com',
      'googleapis.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'about:blank'
    ];
    return allowedDomains.some(domain => url.includes(domain));
  };

  // ===== TRIGGER LOCK =====
  const triggerLock = useCallback((violationType) => {
    if (isLocked) return;
    setIsLocked(true);

    // Log violation
    console.log('VIOLATION:', violationType, new Date().toISOString());

    // Navigate to lock screen
    navigation.replace('Lock', {
      violationType: violationType,
      violationTime: Date.now(),
    });
  }, [isLocked, navigation]);

  // ===== APP STATE MONITORING =====
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background
        setViolationCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            triggerLock('KELUAR_APLIKASI');
          }
          return newCount;
        });
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [triggerLock]);

  // ===== BACK BUTTON BLOCK =====
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      ToastAndroid.show('Tombol back dinonaktifkan selama ujian', ToastAndroid.SHORT);
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // ===== SECURITY TIMER =====
  useEffect(() => {
    securityTimer.current = setInterval(() => {
      // Check if still focused
      if (AppState.currentState !== 'active') {
        setViolationCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            triggerLock('FOCUS_LOST');
          }
          return newCount;
        });
      } else {
        setViolationCount(0);
      }
    }, 1500);

    return () => {
      if (securityTimer.current) clearInterval(securityTimer.current);
    };
  }, [triggerLock]);

  // ===== HANDLE WEBVIEW MESSAGES =====
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'VIOLATION') {
        triggerLock(data.violationType);
      }
    } catch (e) {
      console.log('WebView message:', event.nativeEvent.data);
    }
  };

  // ===== NAVIGATION STATE CHANGE =====
  const onNavigationStateChange = (navState) => {
    if (!isAllowedUrl(navState.url)) {
      webViewRef.current?.goBack();
      ToastAndroid.show('Akses ditolak! Hanya domain ujian yang diizinkan.', ToastAndroid.SHORT);
    }
  };

  if (isLocked) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <SecurityOverlay />
      <WebView
        ref={webViewRef}
        source={{ uri: EXAM_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScript={antiCheatScript}
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        onLoadEnd={() => {
          webViewRef.current?.injectJavaScript(antiCheatScript);
        }}
        allowsLinkPreview={false}
        allowsBackForwardNavigationGestures={false}
        allowsInlineMediaPlayback={true}
        bounces={false}
        scrollEnabled={true}
        textZoom={100}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(request) => {
          return isAllowedUrl(request.url);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default ExamScreen;
