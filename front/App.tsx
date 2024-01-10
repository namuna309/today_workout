import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TextInput } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState("회"); // 드롭다운 메뉴 선택 상태
  const [inputContainers, setInputContainers] = useState([{ key: 0 }]); // 각 inputContainer를 식별할 수 있는 고유 키를 가진 객체 배열


  const onDaySelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  // '+' 버튼 렌더링
  const renderAddButton = () => {
    if (selectedDate) {
      return (
        <TouchableOpacity style={styles.addButton} onPress={addInputContainer}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const resetInputContainers = () => {
    setInputContainers([{ key: 0 }]); // 초기화 (단일 요소 포함 배열로 재설정)
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    resetInputContainers(); // 데이터 저장 후 inputContainers 초기화
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: 'black'
    },
  };

  const saveData = () => {
    // 여기에 데이터 저장 로직 구현
    console.log('저장:', { eventTitle, eventDescription, selectedOption });
    toggleModal(); // 데이터 저장 후 모달 닫기
    resetInputContainers(); // 데이터 저장 후 inputContainers 초기화
  };

  const addInputContainer = () => {
    setInputContainers([...inputContainers, { key: inputContainers.length }]);
  };

  return (
    <View style={styles.container}>
      <CalendarList
        current={Date()}
        onDayPress={onDaySelect}
        markedDates={markedDates}
        horizontal={true}
        pagingEnabled={true}
        style={styles.calendar}
      />
       <TouchableOpacity
            style={[styles.addButton, !selectedDate && styles.addButtonDisabled]}
            onPress={selectedDate ? toggleModal : undefined}
            disabled={!selectedDate}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.fullScreenModal}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.dateBox}>
            <Text>날짜: {selectedDate}</Text>
          </View>
          {inputContainers.map(container => (
            <View key={container.key} style={styles.inputContainer}>
              <View style={styles.inputEventBox}>
                <TextInput
                  style={styles.eventText}
                  onChangeText={setEventTitle}
                  value={eventTitle}
                  placeholder="종목"
                />
              </View>
              <View style={styles.inputVolumeBox}>
                <TextInput
                  style={styles.volumeText}
                  onChangeText={setEventDescription}
                  value={eventDescription}
                  placeholder="볼륨"
                  multiline
                />
                <Picker
                  selectedValue={selectedOption}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}
                >
                  <Picker.Item label="회" value="회" />
                  <Picker.Item label="옵션 2" value="option2" />
                  <Picker.Item label="옵션 3" value="option3" />
                  {/* 추가 옵션 */}
                </Picker>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addInputContainerButton} onPress={addInputContainer}>
            <Text style={styles.addInputContainerButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveData}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'gray',
    height: '100%',
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    right: 25,
    top: 13,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
  },
  addButtonDisabled: {
    opacity: 0.5, // 흐릿하게 표시
  },
  fullScreenModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // 시작 부분에서 정렬 시작
    backgroundColor: 'white',
    height: '50%',
    width: '100%',
    paddingTop: 45, // 상단 여백
    paddingBottom: 60,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 10,
    backgroundColor: 'transparent',
  },
  dateBox: {
    position: 'absolute', // 절대 위치 사용
    width: '50%',
    height: 25,
    alignItems: 'center', // 가운데 정렬
    margin: 10, // dateBox와 inputContainer 사이의 간격
  },
  closeButtonText: {
    fontSize: 15,
    color: 'black',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  inputEventBox: {
    width: '80%',
    marginBottom: 5,
    borderWidth: 1,
  },
  eventText: {
    height: 40,
    textAlign: 'center',
    padding: 10,
    width: '100%',
  },
  inputVolumeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    height: 40,
    borderWidth: 1,
  },
  volumeText: {
    textAlign: 'center',
    width: '58%',  // 볼륨 입력란과 드롭다운 메뉴의 비율을 조정
    padding: 10,
  },
  picker: {
    width: '38%',  // 볼륨 입력란과 드롭다운 메뉴의 비율을 조정
  },
  addInputContainerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // 버튼 상하 여백
  },
  addInputContainerButtonText: {
    color: 'white',
    fontSize: 24,
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    backgroundColor: '#007AFF',
    width: '50%',
    height: 50,
    padding: 15,
    alignItems: 'center', // 가로축 중앙 정렬
    justifyContent: 'center', // 세로축 중앙 정렬
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    // 추가적인 중앙 정렬 스타일이 필요하다면 여기에 추가
  }
});

export default App;