import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';



// tabs
import RecordScreen from './tabs/RecordScreen';


function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MenuTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
const App = () => {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuTabs />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
  
};

export default App;
