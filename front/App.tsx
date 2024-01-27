import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';



// tabs
import RecordScreen from './tabs/RecordScreen';
import ChartScreen from './tabs/ChartScreen';


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
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#000000',}}>
      <Tab.Screen 
      name="Record" 
      component={RecordScreen} 
      options={{
          tabBarLabel: 'Record',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name='pencil'
              type='foundation'
              color= {color}
              size={size}
            />
          ),
        }}/>
      <Tab.Screen name="Chart" component={ChartScreen} 
      options={{
        tabBarLabel: 'Chart',
        tabBarIcon: ({ color, size }) => (
          <Icon
            name='bar-chart'
            type='fontisto'
            color= {color}
            size={size}
          />
        ),
      }}/>
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
