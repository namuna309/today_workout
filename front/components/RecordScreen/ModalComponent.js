import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Divider, Text } from '@rneui/themed';
import { Input } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';


const ModalComponent = ({ selectedDate, modalVisible, onRequestClose }) => {

  const [selectedOption, setSelectedOption] = useState("kg");
  const [visible, setVisible] = useState(false);
  const [inputExercise, setInputExercise] = useState('');
  const [inputSetCount, setSetCount] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [inputReps, setinputReps] = useState('');


  // const toggleModal = () => setVisible(!visible);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalTitleBox}>
          <Text h4 style={styles.h4Style}>{selectedDate}</Text>
        </View>
        <Divider />
        <View style={styles.modalContentBox}>
          <View style={styles.inputExerciseBox}>
            <Input
              leftIcon={{ type: 'material-community', name: 'weight-lifter' }}
              onChangeText={setInputExercise}
              value={inputExercise}
              placeholder="운동 종목을 입력하세요"
            />
          </View>

          <View style={styles.inputDetailBox}>
            <View style={styles.inputSetCountBox}>
              <Input
                onChangeText={setSetCount}
                value={inputSetCount}
                placeholder="세트 수"
              />
            </View>
            <View style={styles.inputWeightBox}>
              <Input
                onChangeText={setInputWeight}
                value={inputWeight}
                placeholder="무게"
                containerStyle={{width: "65%"}}
                inputStyle={{width: "65%"}}
              />
              <Dropdown
              style={styles.weightOptions}
                data= {[
                  { label: 'kg', value: 'kg' },
                  { label: 'g', value: 'g' },
                  { label: 'lbs', value: 'lbs' },
                ]}
                onChangeText={setSelectedOption}
                  value={selectedOption}
                  labelField="label"
          valueField="value"
                placeholder='단위'
              />
            </View>
            <View style={styles.inputRepsBox}>
              <Input
                onChangeText={setinputReps}
                value={inputReps}
                placeholder="반복 횟수"
              />
            </View>

          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={onRequestClose}
          >
            <Text style={styles.textStyle}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitleBox: {
    width: '100%',
    height: 'auto',
    padding: 5
  },
  modalContentBox: {
    width: '100%',
    height: '95%',
    padding: 5,
  },
  inputExerciseBox: {
    width: '100%',
    height: 'auto',
  },
  inputDetailBox: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  weightOptions: {
    width: '35%',
    marginBottom: 25,
  },
  inputSetCountBox: {
    width: '30%'
  },
  inputWeightBox: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRepsBox: {
    width: '30%'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default ModalComponent;