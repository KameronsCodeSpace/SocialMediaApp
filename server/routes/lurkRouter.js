const express = require('express');
const router = express.Router();

//pg-promise
const db = require('./config')

router.get('/:user_id', async (req, res) => {
    try {
        let lurks = await db.any(`
            SELECT 
            *
            FROM lurks
            WHERE user_id = ${req.params.user_id}
        `)
        res.json({
            payload: lurks,
            message: "Success you've reached /lurks"
        })
    } catch(error) {
        res.status(500)
        res.json({
            message: 'error',
        })
    }
})

router.get('/lurkedUsers/:user_id', async (req, res) => {
    try {
        let lurks = await db.any(`
        SELECT 
            users.id, users.username AS User_name, ARRAY_AGG (lurks.lurker_username) AS All_User_Lurked
        FROM lurks, users
        WHERE lurks.user_id = users.id AND users.id = ${req.params.user_id}
        GROUP BY 
            users.id
        ORDER BY 
            All_User_Lurked DESC
        `)
        res.json({
            payload: lurks,
            message: "Success you've reached /lurks"
        })
    } catch(error) {
        res.status(500)
        res.json({
            message: 'error',
        })
    }
})

router.get('/lurkedUserPosts/:username', async (req, res) => {
    try {
        let lurkPosts = await db.any(`
        SELECT 
            posts.body
        FROM users
        INNER JOIN posts ON  users.id = posts.poster_id
        WHERE users.username = ${req.params.username}
        `)
        res.json({
            payload: lurkPosts,
            message: "Success you've reached /lurks"
        })
    } catch(error) {
        res.status(500)
        res.json({
            message: 'error',
        })
    }
})

router.delete('/deleteLurk/:user_id/:lurker_username', async (req, res) => {
    try {
        await db.none(`
        DELETE FROM lurks
        WHERE user_id = ${req.params.user_id}
        AND lurker_username = '${req.params.lurker_username}'
        `)
        res.json({
            payload: [req.params.user_id, req.params.lurker_username],
        })
    } catch(error) {
        res.status(500)
        res.json({
            message: 'error',
            error
        })
    }
})

router.post('/addLurk/:user_id/:lurker_username', async (req, res) => {
    try {
        await db.none(`
            INSERT INTO lurks(user_id, lurker_username)
            VALUES($1, $2)
        `, [req.params.user_id, req.params.lurker_username]
        )
        res.json({
            payload: [req.params.user_id, req.params.lurker_username],
            message: "Success you've reached /likes"
        })
    } catch(error) {
        res.status(500)
        res.json({
            message: 'error',
            error
        })
    }

})

router.get('/')

module.exports = router;