const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { body, param, validationResult } = require('express-validator')

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()) {
        return next()
    } else {
        return res.status(400).json(err.array())
    }
}

router
    .route('/')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
            validate
        ],
        function (req, res, next) {
            var { userId } = req.body

            let sql = 'SELECT * FROM channels WHERE user_id = ?'
            conn.query(sql, userId,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        res.status(400).end()
                    }
                }
            )
        }
    )

    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
            body('name').notEmpty().isString().withMessage('문자열 입력 필요'),
            validate
        ],
        function (req, res) {
            const { name, userId } = req.body
            let sql = 'INSERT INTO channels (name, user_id) VALUES (?,?)'
            let values = [name, userId]
            conn.query(sql, values,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    res.status(201).json(results)
                }
            )
        }
    )

router
    .route('/:id')
    .get(
        [
            param('id').notEmpty().withMessage('채널 아이디 필요'),
            validate
        ],
        function (req, res) {
            let { id } = req.params
            id = parseInt(id)

            let sql = 'SELECT * FROM channels WHERE id = ?'
            conn.query(sql, id,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        res.status(400).end()
                    }
                }
            )
        }
    )

    .put(
        [
            param('id').notEmpty().withMessage('채널 아이디 필요'),
            body('name').notEmpty().isString().withMessage('문자열 입력 필요'),
            validate
        ],
        function (req, res) {
            let { id } = req.params
            id = parseInt(id)
            const { name } = req.body

            sql = 'UPDATE channels SET name = ? WHERE id = ?'
            let values = [name, id]
            conn.query(sql, values,
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

    .delete(
        [
            param('id').notEmpty().withMessage('채널 아이디 필요'),
            validate
        ],
        function (req, res) {
            let { id } = req.params
            id = parseInt(id)

            sql = 'DELETE FROM channels WHERE id = ?'
            conn.query(sql, id,
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