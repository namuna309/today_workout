import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';

const CalendarComponent = ({selectedDate, onDaySelect, workoutDates, handleMonthChange}) => {

  let wd = new Object();
  let markedDates = new Object();

  if (workoutDates.length > 0) {
    workoutDates.forEach((date) => {
      if (date == selectedDate) wd[date] = {selected: true, selectedColor: 'black', selectedDotColor: 'white', marked: true, dotColor: 'red'}
      else wd[date] = { marked: true, dotColor: 'red'}
    })
    
    markedDates = {
      ...wd,
    }; 
  } 
  if (!workoutDates.includes(selectedDate)){
    markedDates[selectedDate] = {selected: true, selectedColor: 'black',}

  } 

  return (
    <View style={styles.calendarContainer}>
      <CalendarList
        current={selectedDate}
        onDayPress={onDaySelect}
        onMonthChange={(month) => handleMonthChange(month)}
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