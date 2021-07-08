import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Signup } from '../screens';

const Stack = createStackNavigator();

const AuthStack = () => {
  const theme = useContext(ThemeContext);
  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{
        headerTitleAlign: 'center',
        cardStyle: { backgroundColor: theme.backgroundColor },
        headerTintColor: theme.headerTintColor,
      }}
    >
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
