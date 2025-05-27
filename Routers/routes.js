const express = require('express');
const { handleGetLogin, handleGetSignUp, handlePostLogin, handlePostSignUp, } = require('../Controller/user.controller');
const router = express.Router()


router.get('/', handleGetLogin);

router.post('/', handlePostLogin)

router.get('/signup', handleGetSignUp)

router.post('/signup', handlePostSignUp)

router.use((req, res, next) => {
    res.status(404).render('404', { title: '404' })
})

module.exports = router