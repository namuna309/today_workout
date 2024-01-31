import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import IconButtonComponent from '../components/RecordScreen/IconButtonComponent';

// 차트에 나올거: 총 운동 볼륨, 최고 무게, 최대 반복수, 최대 세트수
// instagram, inbody 대시보드 참고하기

const ENDPOINT = "http://10.0.2.2:8080"; // 서버 주소


const ChartScreen = ({ }) => {

    // 종목 필터링
    const [isFocus, setIsFocus] = useState(false);
    const [exercise, setExercise] = useState();
    const [exerciseList, setExerciseList] = useState([]);

    // 기간 필터링
    const [startDate, setStartDate] = useState(new Date());
    const getOneMonthBefore = (date) => {
        return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
    };
    const [endDate, setEndDate] = useState(getOneMonthBefore(startDate));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // 차트 
    const [transDatas, setTransData] = useState();
    const chartConfig = {
        backgroundColor: "#FFFFFF",
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientTo: "#FFFFFF",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(89, 89, 89, ${opacity})`,
        style: {
          borderRadius: 16
        },
        fillShadowGradientFromOpacity: 0,
        fillShadowGradientFromOffset: 1,
        propsForVerticalLabels: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        propsForDots: {
            r: "5", // 점(Dot)의 반지름 크기
          },
      };

    // 운동 종목 가져오기
    async function fetchExercises() {
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

    function checkDatas() {
        if (!exercise) return false;
        if (!transDatas) return false;
        if (!transDatas.dates || !transDatas.totalVolumes || !transDatas.maxWeights || !transDatas.maxReps || !transDatas.maxSetCounts) return false;
        if (transDatas.dates.length == 0 || transDatas.totalVolumes.length == 0 || transDatas.maxWeights.length == 0 || transDatas.maxReps.length == 0 || transDatas.maxSetCounts.length == 0) return false;
        
        const arrayLengths = Object.values(transDatas).map(array => array.length);
        const firstLength = arrayLengths[0];

        if(!arrayLengths.every(length => length === firstLength)) return false;

        return true;
    }

    useEffect(() => {
        fetchExercises().then((exercises) => {
            setExerciseList(exercises.map(exercise => ({ label: exercise, value: exercise })));
        })
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchExerciseData();
            setTransData(dataTransform(data)) 
        };
        try {
            if (exercise) {
                fetchData();
            }
        } catch (err) {
            console.log(err);
        }
        
    }, [exercise, startDate, endDate]);

    useEffect(() => {
        console.log('transDatas', transDatas);
    }, [transDatas])

    function formatLabels(dates) {
        const formattedLabels = [];
        const yearsIncluded = new Set();

      
        dates.forEach(dateString => {
          const [year, month, day] = dateString.split('-');
          const shortYear = year.substring(2); // 연도의 마지막 두 자리만 추출

          if (!yearsIncluded.has(year)) {
            yearsIncluded.add(year);
            formattedLabels.push(`${shortYear}.${month}.${day}`);
          } else {
            formattedLabels.push(`${month}.${day}`);
          }
        });
      
        return formattedLabels;
      }

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

        return { dates: formatLabels(dates), totalVolumes: totalVolumes, maxWeights: maxWeight, maxReps: maxReps, maxSetCounts: maxSetCount }
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
                <View style={styles.periodOptions}>
                    <View style={styles.periodOptionsBox}>
                        <View style={styles.periodOptionsIconBox}>
                            <IconButtonComponent 
                                iconName={'calendar'}
                                iconType={'antdesign'}
                                color={'#F45959'}
                                size={20}
                            />
                        </View>
                        <View style={styles.periodOptionsTextBox}>
                            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                                <Text style={styles.periodOptionsText}>{`${endDate.getMonth() + 1}. ${endDate.getDate()}`}</Text>
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
                                <Text style={styles.periodOptionsText}>{`${startDate.getMonth() + 1}. ${startDate.getDate()}`}</Text>
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
                </View>
            </View>
            
            {
                checkDatas() ? (
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
                                                        data: transDatas.totalVolumes,
                                                        color: (opacity = 1) => `rgba(89, 89, 89, ${opacity})`,
                                                        strokeWidth: 5
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={160}   
                                            withHorizontalLabels={false}                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={chartConfig}    
                                            withHorizontalLines = {false} 
                                            getDotColor = {(dataPoint, dataPointIndex) => {
                                                const lastDataIndex = transDatas.dates.length - 1;
                                                return dataPointIndex === lastDataIndex ? '#F45959' : '#595959'; // 'red' for the last point, 'blue' for others
                                            }}
                                            renderDotContent={({ x, y, index }) => (
                                                <View
                                                style={{
                                                    height: 24,
                                                    width: 50, // 텍스트 컨테이너의 너비
                                                    justifyContent: 'center', // 텍스트를 세로 중앙에 정렬
                                                    alignItems: 'center', // 텍스트를 가로 중앙에 정렬
                                                    position: "absolute",
                                                    top: y - 30, // dot 위에 위치시키기 위해 조정
                                                    left: x - 25, // 텍스트 컨테이너 너비의 절반만큼 왼쪽으로 이동하여 중앙 정렬
                                                }}
                                                >
                                                <Text style={{ textAlign: 'center', fontSize: 15, fontSize: 16, fontWeight: '500' }}>{transDatas.totalVolumes[index]}</Text>

                                                </View>
                                            )}
                                            style={styles.chart}                             
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>최고 무게(kg)</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.maxWeights,
                                                        color: (opacity = 1) => `rgba(89, 89, 89, ${opacity})`,
                                                        strokeWidth: 5
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={160}  
                                            yAxisSuffix="kg"
                                            withHorizontalLabels={false}                                            yAxisInterval={1} // optional, defaults to 1
                                            chartConfig={chartConfig}    
                                            withHorizontalLines = {false} 
                                            getDotColor = {(dataPoint, dataPointIndex) => {
                                                const lastDataIndex = transDatas.dates.length - 1;
                                                return dataPointIndex === lastDataIndex ? '#F45959' : '#595959'; // 'red' for the last point, 'blue' for others
                                            }}
                                            renderDotContent={({ x, y, index }) => (
                                                <View
                                                style={{
                                                    height: 24,
                                                    width: 50, // 텍스트 컨테이너의 너비
                                                    justifyContent: 'center', // 텍스트를 세로 중앙에 정렬
                                                    alignItems: 'center', // 텍스트를 가로 중앙에 정렬
                                                    position: "absolute",
                                                    top: y - 30, // dot 위에 위치시키기 위해 조정
                                                    left: x - 25, // 텍스트 컨테이너 너비의 절반만큼 왼쪽으로 이동하여 중앙 정렬
                                                }}
                                                >
                                                <Text style={{ textAlign: 'center', fontSize: 15, fontSize: 16, fontWeight: '500' }}>{transDatas.maxWeights[index]}</Text>

                                                </View>
                                            )}
                                            style={styles.chart}                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>최대 반복 횟수(회)</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.maxReps,
                                                        color: (opacity = 1) => `rgba(89, 89, 89, ${opacity})`,
                                                        strokeWidth: 5
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={160}  
                                            withHorizontalLabels={false}
                                            yAxisInterval={1} // optional, defaults to 1                                            
                                            chartConfig={chartConfig}    
                                            withHorizontalLines = {false} 
                                            getDotColor = {(dataPoint, dataPointIndex) => {
                                                const lastDataIndex = transDatas.dates.length - 1;
                                                return dataPointIndex === lastDataIndex ? '#F45959' : '#595959'; // 'red' for the last point, 'blue' for others
                                            }}
                                            renderDotContent={({ x, y, index }) => (
                                                <View
                                                style={{
                                                    height: 24,
                                                    width: 50, // 텍스트 컨테이너의 너비
                                                    justifyContent: 'center', // 텍스트를 세로 중앙에 정렬
                                                    alignItems: 'center', // 텍스트를 가로 중앙에 정렬
                                                    position: "absolute",
                                                    top: y - 30, // dot 위에 위치시키기 위해 조정
                                                    left: x - 25, // 텍스트 컨테이너 너비의 절반만큼 왼쪽으로 이동하여 중앙 정렬
                                                }}
                                                >
                                                <Text style={{ textAlign: 'center', fontSize: 15, fontSize: 16, fontWeight: '500' }}>{transDatas.maxReps[index]}</Text>

                                                </View>
                                            )}
                                            style={styles.chart}                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.chartsBox}>
                                <View style={styles.chartTitleBox}>
                                    <Text style={styles.chartTitleText}>최대 세트 횟수(Set)</Text>
                                </View>
                                <View style={styles.chartContentBox}>
                                    {/* 라인 차트 */}
                                    <View style={styles.chartContent}>
                                        <LineChart
                                            data={{
                                                labels: transDatas.dates,
                                                datasets: [
                                                    {
                                                        data: transDatas.maxSetCounts,
                                                        color: (opacity = 1) => `rgba(89, 89, 89, ${opacity})`,
                                                        strokeWidth: 5
                                                    }
                                                ]
                                            }}
                                            width={Dimensions.get("window").width} // from react-native
                                            height={160}  
                                            withHorizontalLabels={false}
                                            yAxisInterval={1} // optional, defaults to 1                                            
                                            chartConfig={chartConfig}    
                                            withHorizontalLines = {false} 
                                            getDotColor = {(dataPoint, dataPointIndex) => {
                                                const lastDataIndex = transDatas.dates.length - 1;
                                                return dataPointIndex === lastDataIndex ? '#F45959' : '#595959'; // 'red' for the last point, 'blue' for others
                                            }}
                                            renderDotContent={({ x, y, index }) => (
                                                <View
                                                style={{
                                                    height: 24,
                                                    width: 50, // 텍스트 컨테이너의 너비
                                                    justifyContent: 'center', // 텍스트를 세로 중앙에 정렬
                                                    alignItems: 'center', // 텍스트를 가로 중앙에 정렬
                                                    position: "absolute",
                                                    top: y - 30, // dot 위에 위치시키기 위해 조정
                                                    left: x - 25, // 텍스트 컨테이너 너비의 절반만큼 왼쪽으로 이동하여 중앙 정렬
                                                }}
                                                >
                                                <Text style={{ textAlign: 'center', fontSize: 15, fontSize: 16, fontWeight: '500' }}>{transDatas.maxSetCounts[index]}</Text>

                                                </View>
                                            )}
                                            style={styles.chart}                                        />
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
        backgroundColor: '#E8E8E8'
    },
    ChartScreenHeader: {
        width: '100%',
        height: '10%',
        paddingTop: 10,
        paddingBottom: 14,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#DBDBDB',
        borderBottomWidth: 2.5,
    },
    exerciseDropdown: {
        height: 'auto',
        width: '55%',
    },
    periodOptions: {
        height: 'auto',
        width: '40%',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    periodOptionsBox: {
        height: 'auto',
        width: 'auto',
        backgroundColor: 'white',
        paddingTop: 12,
        paddingBottom: 13,
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
    periodOptionsIconBox: {
        height: 'auto',
        width: 'auto',
        marginRight: 6,
    },
    periodOptionsTextBox: {
        height: 'auto',
        width: 'auto',
        flexDirection: 'row'
    },
    periodOptionsText: {
        fontSize: 16,
        fontWeight: 'bold',
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
        marginTop: 25,
    },
    chartsBox: {
        height: 'auto',
        width: '100%',
    },
    chartTitleBox: {
        height: 'auto',
        width: 'auto',
        paddingHorizontal: 15,
        paddingBottom: 2,
        color: '#0F0F0F'
    },
    chartTitleText: {
        fontSize: 21,
        fontWeight: 'bold',
    },
    chartContentBox: {
        width: '100%',
        height: 'auto',
        paddingTop: 7,
        marginBottom: 35,
    },
    chartContent: {
        width: '100%',
        height: 'auto',   
    },
    chart: {
        paddingVertical: 30, 
        backgroundColor: 'white', 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
    }
})

export default ChartScreen;