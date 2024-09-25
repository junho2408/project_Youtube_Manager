const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');
//jwt 모듈 소환
const jwt = require('jsonwebtoken');
// dotenv 모듈 소환
const dotenv = require('dotenv');
dotenv.config();
// cookie 모듈 소환
const cookie = require('cookie');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {
        return next()
    } else {
        return res.status(400).json(err.array())
    }
};

// 로그인
router.post('/login',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ],
    function (req, res) {
        const { email, password } = req.body
        let sql = 'SELECT * FROM users WHERE email = ?'
        conn.query(sql, email,
            function (err, results) {
                if (err) {
                    console.log(err)
                    return res.status(400).end()
                }

                var loginUser = results[0]
                if (loginUser && loginUser.password == password) {
                    // 토큰 발행
                    const token = jwt.sign({
                        email : loginUser.email,
                        password : loginUser.password,
                        name : loginUser.name
                    }, process.env.PRIVATE_KEY,{
                        expiresIn : '30m',
                        issuer : "junho"
                    });

                    res.cookie("token", token, {
                        httpOnly : true
                    });
                    console.log(token)

                    res.status(200).json({
                        message: `${loginUser.name} 님 로그인 되셨습니다.`,
                        token : token
                    });
                } else {
                    res.status(403).json({
                        message: "이메일 또는 비밀번호가 틀렸습니다."
                    })
                }
            }
        )
    })

// 회원가입
router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('name').notEmpty().isString().withMessage('이름 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        body('contact').notEmpty().isString().withMessage('연락처 확인 필요'),
        validate
    ],
    function (req, res) {
        const { email, name, password, contact } = req.body
        let sql = 'INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)'
        let values = [email, name, password, contact]
        conn.query(sql, values,
            function (err, results) {
                if (err) {
                    console.log(err)
                    return res.status(400).end()
                }

                if (results.affectedRows == 0) {
                    return res.status(400).end()
                } else {
                    res.status(201).json(results)
                }
            }
        )
    })

// 
router
    .route('/users')
    // 회원 개별 조회
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        function (req, res) {
            let { email } = req.body

            let sql = 'SELECT * FROM users WHERE email = ?'
            conn.query(sql, email,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length)
                        res.status(200).json(results)
                }
            )
        }
    )
    // 회원 탈퇴
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        function (req, res) {
            let { email } = req.body

            let sql = 'DELETE FROM users WHERE email = ?'
            conn.query(sql, email,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows == 0) {
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
        }
    )

module.exports = router