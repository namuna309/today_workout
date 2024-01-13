// dontenv(환경변수) import
require('dotenv').config();

// Port 번호
const port = process.env.PORT;

// MongoDB 관련 정보
const mongodb_pw = process.env.MONGODB_PW;
const mongodb_username = process.env.MONGODB_USERNAME;
const mongodb_cluster = process.env.MONGODB_CLUSTER;
const mongodb_clusterUrl = `mongodb+srv://${mongodb_username}:${mongodb_pw}@${mongodb_cluster}.iakheiy.mongodb.net/?retryWrites=true&w=majority`;
const mongodb_db = process.env.MONGODB_DB;


// Library Import
const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');



// 셋팅
const app = express();
app.use(cors({
    origin: '*', // 클라이언트 주소를 명시적으로 설정
    credentials: true
}));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))


// MongoDB 연결
let db;
new MongoClient(mongodb_clusterUrl).connect().then((client) => {
    console.log('DB연결성공');
    db = client.db(mongodb_db);
}).catch((err) => {
    console.log(err);
})


// Server listening
app.listen(port, () => {
    console.log(`http://localhost:${port} 에서 서버 실행중`)
})


app.post('/workout/save', async (req, res) => {
    let data = req.body.workouts[0];
    console.log(data);
    let totalWorkout = parseInt(data.workoutweight) * parseInt(data.workoutCount) * parseInt(data.workoutSet);
    if (data.selectedWOption == 'g') totalWorkout *= 1000;
    let todayWorkout = {
            eventTitle: data.eventTitle,
            workoutweight: parseInt(data.workoutweight),
            selectedWOption: data.selectedWOption,
            workoutSet: parseInt(data.workoutSet),
            workoutCount: parseInt(data.workoutCount),
            selectedCOption: data.selectedCOption,
            totalWorkout: totalWorkout,
            date: data.date
          }
    try {
        let saveWorkoutResult = await db.collection('workouts').insertOne(todayWorkout);
        console.log(saveWorkoutResult);
        res.status(200).send({ message: '데이터가 성공적으로 저장되었습니다.' });
      } catch (error) {
        res.status(500).send({ message: '서버 에러 발생' });
        console.error('데이터 저장 에러:', error);
      }
})

app.post('/workout/getDate', async (req, res) => {
    let savedData = await db.collection('workouts').find({date: req.query.date});
    
    return res.status(200).send(req.query.date);
})