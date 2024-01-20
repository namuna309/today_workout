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
const ObjectId = require('mongodb').ObjectId;
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
    console.log(`http://10.0.2.2:${port} 에서 서버 실행중`)
})


app.post('/workout/save', async (req, res) => {
    let data = req.body;
    console.log(data);
    const validationResult = validateData(data);
    try {
        if (!validationResult.isValid) {
            return res.json({ message: validationResult.message });
        }
        else {
            console.log(req.body._id);
            if (req.body._id) {
                let updateWorkoutResult = await db.collection('records').updateOne({_id: new ObjectId(req.body._id)}, {$set:{details: req.body.details, note: req.body.note}})
                if (!updateWorkoutResult) {
                    return res.status(500).json({ message: '데이터 수정 실패' });
                }

                return res.status(200).json({ message: '데이터 수정 성공' });
            } else {
                let saveWorkoutResult = await db.collection('records').insertOne(data);
                if (!saveWorkoutResult.acknowledged) {
                    // 500 Internal Server Error 응답
                    return res.status(500).json({ message: '데이터 저장 실패' });
                }

                 // 성공 응답
                return res.status(200).json({ message: '데이터 저장 성공' });
            }
            

           
        }
    }
    catch (err) {
        return res.json({ message: `처리 중 에러 발생 -> ${err}` })
    }
})



// 데이터 유효성 검사
function validateData(data) {
    if (!data) {
        return { isValid: false, message: '데이터가 없습니다.' };
    }

    const { date, exercise, details, note } = data;

    // 날짜, 운동, 상세 기록, 메모 필드 존재 확인
    if (!date || !exercise ) {
        return { isValid: false, message: '날짜 또는 운동 종목이 누락되었습니다.' };
    }

    // 날짜 형식 확인 (예: 'YYYY-MM-DD')
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return { isValid: false, message: '날짜 형식이 잘못되었습니다.' };
    }

    // 'exercise'가 문자열인지 확인
    if (typeof exercise !== 'string' || exercise.trim() === '') {
        return { isValid: false, message: '운동 이름은 문자열이어야 합니다.' };
    }

    // 'details' 배열 확인 및 각 항목 검증
    if (!Array.isArray(details) || details.some(detail => {
        return !detail.setCount || !detail.weight || !detail.option || !detail.reps ||
            isNaN(detail.setCount) || isNaN(detail.weight) || isNaN(detail.reps);
    })) {
        return { isValid: false, message: '상세 기록 형식이 잘못되었습니다.' };
    }

    return { isValid: true, message: '유효한 데이터입니다.' };
}


app.get('/workout/getData', async (req, res) => {
    try {
        const date = req.query.d;
        if (!date) {
            return res.status(400).send('날짜 파라미터가 필요합니다.');
        }

        let savedData = await db.collection('records').find({ date: date }).toArray();
        if(!savedData) console.log('데이터 없음');
        else console.log(savedData);
        return res.status(200).json(savedData);
    } catch (err) {
        console.error('Database query error', err);
        return res.status(500).send('서버 오류');
    }
});

app.get('/workout/deleteData', async (req, res) => {
    try {
        const recordId = req.query.rid;
        if (!recordId) {
            return res.status(400).send('기록 document id가 필요합니다.');
        }

        let deleteData = await db.collection('records').deleteOne({_id : new ObjectId(recordId)});
        
        if(!deleteData) onsole.log('삭제 데이터 없음');
        else console.log(deleteData);
        return res.status(200).json(deleteData);
    } catch (err) {
        console.error('Database query error', err);
        return res.status(500).send('서버 오류');
    }
})