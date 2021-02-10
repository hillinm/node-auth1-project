const router = require('express').Router();
const users = require('../users/users-model.js');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    let user = req.body;
    
    const hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;

    try {
        const savedUser = await users.add(user);
        res.status(201).json(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'error registering user', error: err });
    }
})

router.post('/login', async (req, res) => {
    let {username, password} = req.body;

    try {
        const user = await users.findBy({username}).first();
        
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json('Logged In');
        } else {
            res.status(401).json({message:'You shall not pass!'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'error registering user', error: err });
    }
})

router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.send('you can check out, but you can never leave')
        } else {
          res.send('so long and thanks for all the fish...')
        }
      })
    } else {
        res.end();
    }
  })

module.exports = router;