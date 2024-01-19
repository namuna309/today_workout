import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, Modal, Text, TouchableOpacity } from 'react-native';
// Components
import CalendarComponent from '../components/RecordScreen/CalendarComponent';
import IconButtonComponent from '../components/RecordScreen/IconButtonComponent';
import ModalComponent from '../components/RecordScreen/ModalComponent';

const RecordScreen = ({ }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // 현재 날짜를 YYYY-MM-DD 형식으로 얻기
  const currentDate = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 날짜별 DB 저장된 운동 데이터 가져오기
  const [workoutData, setWorkoutData] = useState([]);

  const isButtonDisabled = record => record.note.trim() === '';

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const fetchWorkoutData = async (selectedDate) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/workout/getData?d=${selectedDate}`, {
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

  useEffect(() => {
    // 선택된 날짜가 변경될 때마다 운동 기록 가져오기
    fetchWorkoutData(selectedDate).then(data => {
      setWorkoutData(data);
      console.log(data);
    });
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <CalendarComponent selectedDate={selectedDate} onDaySelect={onDaySelect} />
      <ScrollView style={styles.recordContainer}>
        
        {workoutData.map((record, index) => (
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
            </View>
            
            <View style={styles.noteContainer}>
            <TouchableOpacity
              disabled={isButtonDisabled(record)}
              style={isButtonDisabled(record) ? styles.disabledBtn : {}}
            >
              <IconButtonComponent 
                iconName='pencil-square-o'
                iconType='font-awesome'
                color='#464646'
                size='25'
              />
              </TouchableOpacity>
            </View>
            
          </View>
        ))}
        
        <View style={styles.addRecordBtnContainer}>
          <TouchableOpacity onPress={toggleModal}>
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
      <ModalComponent selectedDate={selectedDate} modalVisible={modalVisible} onRequestClose={toggleModal} />
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
    width: '80%',
    height:'auto',
    marginTop: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 204, 204, 0.6)'
  },
  recordTitle :{
    width: '34%',
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
    height: '85%',
    width: '1.3%',
    backgroundColor: 'black',
    borderRadius: 5
  },
  recordContent: {
    width: '64%',
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
    width: '18%',
    height:'auto',
    marginTop: 5,
    marginLeft: '2%',
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 204, 204, 0.6)'
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