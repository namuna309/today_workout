import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';

// 차트에 나올거: 총 운동 볼륨, 최고 무게, 최대 반복수, 최대 세트수
// instagram, inbody 대시보드 참고하기

const ENDPOINT = "http://10.0.2.2:8080"; // 서버 주소


const ChartScreen = ({ }) => {

    // 종목 필터링
    const [isFocus, setIsFocus] = useState(false);
    const [exercise, setExercise] = useState();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [exerciseList, setExerciseList] = useState([]);

    // 무게 단위 선택
    const [weightOption, setWeightOption] = useState();
    const [wodropdownVisible, setWodropdownVisible] = useState(false);
    const [weightOptionList, setWeightOptionList] = useState([])

    // 기간 필터링
    const [startDate, setStartDate] = useState(new Date());
    const getOneMonthBefore = (date) => {
        return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
    };
    const [endDate, setEndDate] = useState(getOneMonthBefore(startDate));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // 차트 
    const [labels, setLabels] = useState([]);
    const [rawDatas, setRawDatas] = useState();
    const [transDatas, setTransData] = useState();




    // 운동 종목 가져오기
    async function fetchExercises()  {
        const url = new URL(`${ENDPOINT}/exercises/getExs`);
        try {
            const response = await fetch(url, {
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
            console.log('Fetch error:', error);
        }
    }

    const fetchExerciseData = async () => {
        const url = new URL(`${ENDPOINT}/records/period`);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        url.searchParams.append('exercise', exercise);
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                credentials: 'include',
            });
            if (!response.ok) {
                console.log('Server response error');
            }
            
            return await response.json();
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };


    useEffect(() => {
        fetchExercises().then((exercises) => {
            setExerciseList(exercises.map(exercise => ({ label: exercise, value: exercise })));
        })
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchExerciseData();
            setRawDatas(data);
        };
    
        fetchData();
    }, [exercise, startDate, endDate]);

    useEffect(()=>{
        let d = new Array();
        try{
            setTransData(dataTransform(rawDatas))
        } 
        catch (err) {
            console.log('rawDatas: ', rawDatas, ' => 데이터가 없습니다');
        }
        
    }, [rawDatas])

    function dataTransform(records) {
        let dates = new Array();
        let totalVolumes = new Array();
        let maxWeight = new Array();
        let maxReps = new Array();
        let maxSetCount = new Array();

        records.forEach((record) => {
            let date = new Date(record.date).toISOString().split('T')[0];
            let volumeList = new Array();
            let weightList = new Array();
            let repsList = new Array();
            let setCountList = new Array();
            record.details.forEach((detail) => {
                weightList.push(parseInt(detail.weight));
                repsList.push(parseInt(detail.reps));
                setCountList.push(parseInt(detail.setCount));
                volumeList.push(parseInt(detail.setCount) * parseInt(detail.reps) * parseInt(detail.weight))
            })
            dates.push(date);
            totalVolumes.push(volumeList.reduce((a, b) => a + b, 0));
            maxWeight.push(Math.max(...weightList));
            maxReps.push(Math.max(...repsList));
            maxSetCount.push(Math.max(...setCountList));
        })
    
        return {dates: dates, totalVolumes: totalVolumes, maxWeights: maxWeight, maxReps: maxReps, maxSetCounts: maxSetCount}
    }


    return (
        <View style={styles.ChartScreenContainer}>
            <View style={styles.ChartScreenHeader}>
                <View style={styles.exerciseDropdown}>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        containerStyle={styles.containerStyle}
                        itemTextStyle={styles.itemTextStyle}
                        itemContainerStyle={styles.itemContainerStyle}
                        data={exerciseList}
                        search
                        searchPlaceholder="Search..."
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? '운동 종목' : '...'}
                        onChange={item => {
                            setExercise(item.value);
                            setIsFocus(false);
                        }}
                    />
                </View>
            </View>
            <View style={styles.periodOptions}>
                <View style={styles.periodOptionsBox}>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                        <Text style={styles.periodOptionsText}>{`${endDate.getMonth() + 1}월 ${endDate.getDate()}일`}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={onChangeEndDate}
                        />
                    )}
                    <Text style={styles.periodOptionsText}>{' ~ '}</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                        <Text style={styles.periodOptionsText}>{`${startDate.getMonth() + 1}월 ${startDate.getDate()}일`}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onChangeStartDate}
                        />
                    )}
                </View>
            </View>
            {
                exercise && rawDatas && transDatas ? (
                    <>

                        <ScrollView style={styles.chartsContainer}>
                            {/* 차트 컴포넌트 */}
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>총 운동볼륨</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.totalVolumes
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={200}
                                            yAxisLabel="$"
                                            yAxisSuffix="k"
                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={{
                                                backgroundColor: "#e26a00",
                                                backgroundGradientFrom: "#fb8c00",
                                                backgroundGradientTo: "#ffa726",
                                                decimalPlaces: 2, // optional, defaults to 2dp
                                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                style: {
                                                    borderRadius: 16
                                                },
                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                    stroke: "#ffa726"
                                                }
                                            }}
                                            bezier
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>최고 무게</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.maxWeights
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={200}
                                            yAxisLabel="$"
                                            yAxisSuffix="k"
                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={{
                                                backgroundColor: "#e26a00",
                                                backgroundGradientFrom: "#fb8c00",
                                                backgroundGradientTo: "#ffa726",
                                                decimalPlaces: 2, // optional, defaults to 2dp
                                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                style: {
                                                    borderRadius: 16
                                                },
                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                    stroke: "#ffa726"
                                                }
                                            }}
                                            bezier
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>최대 반복 횟수</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.maxReps
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={200}
                                            yAxisLabel="$"
                                            yAxisSuffix="k"
                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={{
                                                backgroundColor: "#e26a00",
                                                backgroundGradientFrom: "#fb8c00",
                                                backgroundGradientTo: "#ffa726",
                                                decimalPlaces: 2, // optional, defaults to 2dp
                                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                style: {
                                                    borderRadius: 16
                                                },
                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                    stroke: "#ffa726"
                                                }
                                            }}
                                            bezier
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>최대 세트 횟수</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.maxSetCounts
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={200}
                                            yAxisLabel="$"
                                            yAxisSuffix="k"
                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={{
                                                backgroundColor: "#e26a00",
                                                backgroundGradientFrom: "#fb8c00",
                                                backgroundGradientTo: "#ffa726",
                                                decimalPlaces: 2, // optional, defaults to 2dp
                                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                style: {
                                                    borderRadius: 16
                                                },
                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                    stroke: "#ffa726"
                                                }
                                            }}
                                            bezier
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView></>

                ) : null
            }

        </View>
    )
}

const styles = StyleSheet.create({
    ChartScreenContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E3E3E3'
    },
    ChartScreenHeader: {
        width: '100%',
        height: '8%',
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    exerciseDropdown: {
        height: 'auto',
        width: '100%',
    },
    periodOptions: {
        height: 'auto',
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    periodOptionsBox: {
        height: 'auto',
        width: 'auto',
        backgroundColor: 'white',
        paddingTop: 9,
        paddingBottom: 10,
        paddingHorizontal: 15,
        borderRadius: 1000,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    periodOptionsText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    dropdown: {
        height: '100%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 15,
    },
    containerStyle: {
        height: 'auto',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
    },
    itemContainerStyle: {
        borderColor: 'gray',
        borderWidth: 0.5,
    },
    itemTextStyle: {
        fontSize: 18,
        textAlign: 'center',
    },
    placeholderStyle: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    selectedTextStyle: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        textAlign: 'center',
    },
    chartsContainer: {
        height: 'auto',
        width: '100%',
        paddingTop: 10,
    },
    chartsBox: {
        height: 'auto',
        width: '100%',
    },
    chartTitleBox: {
        height: 'auto',
        width: 'auto',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    chartTitleText: {
        fontSize: 21,
        fontWeight: 'bold',
    },
    chartContentBox: {
        width: '100%',
        height: 'auto',
        paddingTop: 7,
        marginBottom: 5,
    },
    chartContent: {
        width: '100%',
        height: 'auto',
        overflow: 'hidden',
    }
})

export default ChartScreen;