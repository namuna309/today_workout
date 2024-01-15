import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';

const CalendarComponent = ({selectedDate, onDaySelect}) => {

  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: 'black' },
  };

  return (
    <View style={styles.calendarContainer}>
      <CalendarList
        current={Date()}
        onDayPress={onDaySelect}
        markedDates={markedDates}
        horizontal={true}
        pagingEnabled={true}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    width: '100%',
  },
});

export default CalendarComponent;