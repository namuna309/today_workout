import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Modal, Text, TouchableOpacity } from 'react-native';
// Components
import CalendarComponent from '../components/RecordScreen/CalendarComponent';
import IconButtonComponent from '../components/RecordScreen/IconButtonComponent';
import ModalComponent from '../components/RecordScreen/ModalComponent';

const RecordScreen = ({ }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recordData, setRecordData] = useState({ exercise: '', details: [{ setCount: '', weight: '', option: 'kg', reps: '' }], note: '' })

  // 현재 날짜를 YYYY-MM-DD 형식으로 얻기
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 날짜별 DB 저장된 운동 데이터 가져오기
  const [workoutData, setWorkoutData] = useState([]);

  // 월별 DB 저장된 운동 날짜 가져오기
  const [currentMonth, setCurrentMonth] = useState('');
  const [workoutDates, setWorkoutDates] = useState([]);

  const isButtonDisabled = record => record.note.trim() === '';

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month.month);
    setSelectedDate(month.dateString);
  };

  const toggleModal = (record) => {
    console.log(record);
    setRecordData(record);
    setModalVisible(!modalVisible);
  };

  const fetchData = async () => {
    const data = await fetchWorkoutData(selectedDate);
    setWorkoutData(data);

  };

  const deleteData = async (record) => {
    try {
      console.log(record);
      const response = await fetch(`http://10.0.2.2:8080/workout/deleteData?rid=${record._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        credentials: 'include',
      });
      if (!response.ok) {
        Alert.alert('Server response error');
      }
      fetchData();
      console.log('Data successfully deleted to the server:', record);
    } catch (error) {
      Alert.alert('Fetch error:', error);
    }

  }

  // ModalComponent에서 사용할 저장 완료 콜백
  const onSaveComplete = () => {
    fetchData();
  };

  const fetchWorkoutData = async (selectedDate) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/workout/getData?d=${new Date(selectedDate).valueOf()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        credentials: 'include',
      });
      if (!response.ok) {
        Alert.alert('Server response error');
      }
      return await response.json();
    } catch (error) {
      Alert.alert('Fetch error:', error);
    }
  };

  const fetchWorkoutDates = async (selectedDate) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/records/getExDates?date=${new Date(selectedDate).valueOf()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        credentials: 'include',
      });
      if (!response.ok) {
        Alert.alert('Server response error');
      }
      return await response.json();
    } catch (error) {
      Alert.alert('Fetch error:', error);
    }
  }


  useEffect(() => {
    // 선택된 날짜가 변경될 때마다 운동 기록 가져오기
    fetchWorkoutData(selectedDate).then(data => {
      setWorkoutData(data);
    });
  }, [selectedDate]);

  useEffect(() => {
    // 달별 운동 기록이 있는 날짜 가져오기
    fetchWorkoutDates(selectedDate).then(data => {
      let dates = new Array(); 
      data.map((record) => {
        dates.push(new Date(record.date).toISOString().split('T')[0])
      })
      setWorkoutDates(dates);
    })
  }, [currentMonth, workoutData])

  const handleLongPress = (record) => {
    Alert.alert(
      "운동 기록 관리",
      "원하는 작업을 선택하세요",
      [
        {
          text: "삭제",
          onPress: () => deleteData(record),
          style: "destructive"
        },
        {
          text: "닫기",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <CalendarComponent selectedDate={selectedDate} onDaySelect={onDaySelect} workoutDates={workoutDates} handleMonthChange={handleMonthChange}/>
      <ScrollView style={styles.recordContainer}>

        {workoutData.map((record, index) => (
          <TouchableOpacity 
          onPress={() => toggleModal(workoutData[index])}
          onLongPress={() => handleLongPress(record)}
          >
            <View style={styles.viewRecordContainer}>
              <View style={styles.viewRecordBox}>
                <View style={styles.recordTitle}>
                  <View style={styles.recordTitleTxtBox}>
                    <Text style={styles.recordTitleTxt}>{record.exercise}</Text>
                  </View>
                </View>
                <View style={styles.devideLine}></View>
                <View style={styles.recordContent}>
                  {
                    record.details.map((detail, idx) => {
                      return (
                        <View style={styles.recordDetail}>
                          <Text style={styles.recordDetailTxt}>{detail.weight}{detail.option}</Text>
                          <Text style={styles.recordDetailTxt}>{detail.reps}회</Text>
                          <Text style={styles.recordDetailTxt}>{detail.setCount}SET</Text>
                        </View>
                      )
                    })

                  }
                </View>
                <View style={styles.devideLine}></View>
                <View style={styles.noteContainer}>
                  <View
                    style={isButtonDisabled(record) ? styles.disabledBtn : {}}
                  >
                    <IconButtonComponent
                      iconName='pencil-square-o'
                      iconType='font-awesome'
                      color='#464646'
                      size='25'
                    />
                  </View>
                </View>
              </View>



            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.addRecordBtnContainer}>
          <TouchableOpacity onPress={() => toggleModal({ exercise: '', details: [{ setCount: '', weight: '', option: 'kg', reps: '' }], note: '' })}>
            <View style={styles.addRecordBtn}>
              <IconButtonComponent
                iconName='plus-circle'
                iconType='feather'
                size='25'
                color='#464646'
              />

              <View style={styles.addRecordBtnTxtBox}>
                <Text style={styles.addRecordBtnTxt}>운동 기록 추가</Text>
              </View>

            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModalComponent recordData={recordData} selectedDate={selectedDate} modalVisible={modalVisible} onRequestClose={toggleModal} onSaveComplete={onSaveComplete} />
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
  recordContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  viewRecordContainer: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 35,
  },
  viewRecordBox: {
    width: '100%',
    height: 'auto',
    marginTop: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 204, 204, 0.6)'
  },
  recordTitle: {
    width: '30%',
    height: '100%',
    padding: 5,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordTitleTxtBox: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordTitleTxt: {
    width: 'auto',
    height: 'auto',
    fontSize: 15,
    alignSelf: 'center',
    color: '#464646',
  },
  devideLine: {
    height: '75%',
    width: '1.1%',
    backgroundColor: 'black',
    borderRadius: 5
  },
  recordContent: {
    width: '50%',
    height: 'auto',
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'column',
  },
  recordDetail: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
  },
  recordDetailTxt: {
    width: 'auto',
    height: 'auto',
    fontSize: 15,
    marginRight: 10,
    color: '#464646',
  },
  noteContainer: {
    width: '17%',
    height: '100%',
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.4, // 비활성화 시 투명도 변경
  },
  addRecordBtnContainer: {
    width: '100%',
    height: 'auto',
    paddingVertical: 5,
    paddingHorizontal: 35,
  },
  addRecordBtn: {
    width: '100%',
    height: 'auto',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#517fa4',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(204, 204, 204, 0.6)'
  },

  addRecordBtnTxtBox: {
    width: 'auto',
    height: 'auto',
    marginLeft: 10,
  },
  addRecordBtnTxt: {
    color: '#464646',
    fontSize: 20,
  }

});

export default RecordScreen;