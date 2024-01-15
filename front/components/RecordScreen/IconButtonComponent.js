import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';

const IconButtonComponent = ({ iconName, onPress }) => {
  return (
    <View style={styles.iconBox}>
      
      <Icon
        name={iconName}
        type='feather'
        color='#c8c8c8'
        onPress={onPress}
        size={60}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export default IconButtonComponent;