import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';

const IconButtonComponent = ({ iconName, iconType, onPress, color, size }) => {
  return (
    <View style={styles.iconBox}>
      
      <Icon
        name={iconName}
        type={iconType}
        color={color}
        onPress={onPress}
        size={parseInt(size)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    position: 'relative',
    width: 'auto',
    height: 'auto',
  },
});

export default IconButtonComponent;