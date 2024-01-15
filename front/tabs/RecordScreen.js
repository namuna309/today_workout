import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, Text } from 'react-native';
// Components
import CalendarComponent from '../components/RecordScreen/CalendarComponent';
import IconButtonComponent from '../components/RecordScreen/IconButtonComponent';
import ModalComponent from '../components/RecordScreen/ModalComponent';
const RecordScreen = ({}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    
    const onDaySelect = (day) => {
      setSelectedDate(day.dateString);
    };
  
    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };

  return (
    <View style={styles.container}>
      <CalendarComponent selectedDate={selectedDate} onDaySelect={onDaySelect} />
      <ScrollView style={styles.iconContainer}>
        <IconButtonComponent 
          iconName='plus-circle' 
          onPress={toggleModal} 
        />
      </ScrollView>
      <ModalComponent selectedDate={selectedDate} modalVisible={modalVisible} onRequestClose={toggleModal}/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    iconContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
   
  });

export default RecordScreen;