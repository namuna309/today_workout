import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Divider, Text, Icon } from '@rneui/themed';
import { Input } from '@rneui/base';
import { Dropdown } from 'react-native-element-dropdown';
import { SwipeListView } from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import IconButtonComponent from './IconButtonComponent';


const ModalComponent = ({ recordData, selectedDate, modalVisible, onRequestClose, onSaveComplete  }) => {
  const [inputExercise, setInputExercise] = useState('');
  const [inputDetails, setInputDetails] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (recordData) {
      console.log(recordData);
      setInputExercise(recordData.exercise);
      setInputDetails(recordData.details);
      setNote(recordData.note);
    }
  }, [recordData]);

  const addInputDetail = () => {
    setInputDetails([...inputDetails, { setCount: '', weight: '', option: 'kg', reps: '',}]);
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

  // 입력 데이터 저장
  const handleSave = () => {
    const isValid = inputDetails.every(detail => detail.setCount && detail.weight && detail.reps);
    if (!inputExercise) {
      Alert.alert('오류', '운동 종목을 입력해주세요');
      return;
    }
    if (!isValid) {
      Alert.alert('오류', '모든 필드를 올바르게 입력해주세요.');
      return;
    }
    const saveData = {_id: recordData._id, date: selectedDate, exercise: inputExercise, details: inputDetails, note: note }
    handleSaveToDatabase(saveData);
  };

  // db저장  
  const handleSaveToDatabase = async (data) => {
    try {
      const response = await fetch('http://10.0.2.2:8080/workout/save', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        Alert.alert(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const responseData = await response.json();
        console.log('Data successfully saved to the server:', responseData);
        onSaveComplete(); // 콜백 호출
        onRequestClose();
      }

      
      // 추가적인 성공 처리 로직
    } catch (error) {
      console.error('There was a problem saving data:', error);
      Alert.alert(`HTTP error! status: ${response.status}`)
    }
  };

  const removeInputDetail = (index) => {
    const updatedDetails = inputDetails.filter((_, idx) => idx !== index);
    setInputDetails(updatedDetails);
  };


  return (
    <Modal
      isVisible={modalVisible}
      onSwipeComplete={onRequestClose}
      swipeDirection="down"
      style={styles.modalView}
      propagateSwipe // 스크롤뷰와 같은 내부 컴포넌트의 스와이프 동작을 허용
      animationIn="slideInUp" // 위에서 아래로 슬라이드하는 애니메이션
      animationOut="slideOutDown" // 아래로 슬라이드하며 사라지는 애니메이션
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeadBox}>
          <TouchableOpacity onPress={onRequestClose}>
            <IconButtonComponent
              iconName='cross'
              iconType='entypo'
              size='30'
              color='#464646'
            />
          </TouchableOpacity>
          <View style={styles.modalTitleBox}>
            <Text h4 style={styles.h4Style}>{selectedDate}</Text>
          </View>
          <TouchableOpacity onPress={handleSave}>
            <IconButtonComponent
              iconName='check'
              iconType='material-community'
              size='30'
              color='#464646'
            />
          </TouchableOpacity>
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
            renderItem={({ item, index }) => (
              <View key={index} style={styles.inputDetailBox}>
                <View style={styles.inputSetCountBox}>
                  <Input
                    keyboardType="numeric"
                    onChangeText={(text) => handleInputChange(text, index, 'setCount')}
                    value={item.setCount}
                    placeholder="세트 수"
                  />
                </View>
                <View style={styles.inputWeightBox}>
                  <Input
                    keyboardType="numeric"
                    onChangeText={(text) => handleInputChange(text, index, 'weight')}
                    value={item.weight}
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
                    value={item.option}
                    labelField="label"
                    valueField="value"
                    placeholder='단위'
                  />
                </View>
                <View style={styles.inputRepsBox}>
                  <Input
                    keyboardType="numeric"
                    onChangeText={(text) => handleInputChange(text, index, 'reps')}
                    value={item.reps}
                    placeholder="반복 횟수"
                  />
                </View>
              </View>


            )}
            renderHiddenItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.deleteButtonBox}
                onPress={() => removeInputDetail(index)}
              >
                <View style={styles.deleteButton}>
                  <Icon
                    name='trash-sharp'
                    type='ionicon'
                    color='#ff3232'
                    size={35}
                  />
                </View>
              </TouchableOpacity>
            )}
            rightOpenValue={-80}
            stopLeftSwipe={100}
          />


        </View>
        <TouchableOpacity onPress={addInputDetail}>
          <View style={styles.modalPlusIcon}>
            <Icon
              name='pluscircle'
              type='antdesign'
              color='#517fa4'
              size={40}
            />
          </View>
        </TouchableOpacity>
        {/* 메모장 */}
        <TextInput
          style={styles.noteInput}
          multiline
          numberOfLines={4}
          onChangeText={setNote}
          value={note}
          placeholder="메모를 입력하세요"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  modalHeadBox: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalTitleBox: {
    width: 'auto',
    height: 'auto',
    padding: 5
  },
  modalContentBox: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  }, noteInput: {
    width: '90%',
    height: 100,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    fontSize: 18
  },
  closeOrsaveContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  closeBtnBox: {
    width: '30%',
    paddingLeft: 10,
    paddingRight: 10
  },
  saveBtnBox: {
    width: '30%',
    paddingLeft: 10,
    paddingRight: 10
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
    width: 80,
    height: '100%',
    backgroundColor: '#4c0000',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  }
});

export default ModalComponent;