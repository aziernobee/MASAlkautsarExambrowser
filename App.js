import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExamScreen from './src/screens/ExamScreen';
import LockScreen from './src/screens/LockScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Exam"
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen 
          name="Exam" 
          component={ExamScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false,
            animation: 'none'
          }}
        />
        <Stack.Screen 
          name="Lock" 
          component={LockScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false,
            animation: 'none'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
