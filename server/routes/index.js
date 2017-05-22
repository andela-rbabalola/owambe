const router = require('express').Router();

router.route('/')
  .get((req, res) => {
    res.json({
      status: 200,
      message: 'Welcome to the Owambe API'
    });
  });

export default router;
