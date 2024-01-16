import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Divider, Text, Icon } from '@rneui/themed';
import { Input } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import { SwipeListView } from 'react-native-swipe-list-view';


const ModalComponent = ({ selectedDate, modalVisible, onRequestClose }) => {
  const [visible, setVisible] = useState(false);
  const [inputExercise, setInputExercise] = useState('');
  const [inputSetCount, setSetCount] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [selectedOption, setSelectedOption] = useState("kg");
  const [inputReps, setinputReps] = useState('');
  const [inputDetails, setInputDetails] = useState([{ setCount: '', weight: '', option: 'kg', reps: '' }]);

  const addInputDetail = () => {
    setInputDetails([...inputDetails, { setCount: '', weight: '', option: 'kg', reps: '' }]);
  };

  const handleInputChange = (text, index, field) => {
    const updatedDetails = inputDetails.map((inputdetail, idx) => {
      if (idx === index) {
        return { ...inputdetail, [field]: text };
      }
      return inputdetail;
    });
    setInputDetails(updatedDetails);
  };

  const removeInputDetail = (index) => {
    console.log(index);
    const updatedDetails = inputDetails.filter((_, idx) => idx !== index);
    setInputDetails(updatedDetails);
  };

  console.log(inputDetails)

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
          
            <SwipeListView
              data={inputDetails}
              renderItem={(inputDetail, index) => (
                
                    <View key={index} style={styles.inputDetailBox}>
                      <View style={styles.inputSetCountBox}>
                        <Input
                          onChangeText={(text) => handleInputChange(text, index, 'setCount')}
                          value={inputDetail.setCount}
                          placeholder="세트 수"
                        />
                      </View>
                      <View style={styles.inputWeightBox}>
                        <Input
                          onChangeText={(text) => handleInputChange(text, index, 'weight')}
                          value={inputDetail.weight}
                          placeholder="무게"
                          containerStyle={{ width: "65%" }}
                          inputStyle={{ width: "65%" }}
                        />
                        <Dropdown
                          style={styles.weightOptions}
                          data={[
                            { label: 'kg', value: 'kg' },
                            { label: 'g', value: 'g' },
                            { label: 'lbs', value: 'lbs' },
                          ]}
                          onChange={(opt) => handleInputChange(opt.label, index, 'option')}
                          value={inputDetail.option}
                          labelField="label"
                          valueField="value"
                          placeholder='단위'
                        />
                      </View>
                      <View style={styles.inputRepsBox}>
                        <Input
                          onChangeText={(text) => handleInputChange(text, index, 'reps')}
                          value={inputDetail.reps}
                          placeholder="반복 횟수"
                        />
                      </View>
                    </View>
                  
                
              )}
              renderHiddenItem={({inputDetail, index}) => (
                <TouchableOpacity
                  style={styles.deleteButtonBox}
                  onPress={() => removeInputDetail(index)}
                >
                  <View style={styles.deleteButton}>
                  <Icon
              name='trash-sharp'
              type='ionicon'
              color='#ff3232'
              size={30}
            />
                  </View>
                </TouchableOpacity>
              )}
              rightOpenValue={-80}
              stopLeftSwipe={100}
            />
          
          <TouchableOpacity onPress={addInputDetail}>
            <View style={styles.modalPlusIcon}>
              <Icon
                name='pluscircle'
                type='antdesign'
                color='#517fa4'
                size={30}
              />
            </View>
          </TouchableOpacity>
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
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white'
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
  modalPlusIcon: {
    width: 'auto',
    height: 'auto',
    marginBottom: 20,
  }, 
  deleteButtonBox: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-end'
  },
  deleteButton: {
    width:80,
    height: '100%',
    backgroundColor: '#4c0000',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  }
});

export default ModalComponent;