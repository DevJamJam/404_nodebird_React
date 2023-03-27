const express = require('express');

const router = express.Router();

router.post('/',(req,res)=>{
    res.json([{id: 2, content: 'jin'},'작성완료']);
})
router.delete('/',(req,res)=>{
    res.json([{id:3, content: 'vervon'}]);
})


module.exports = router;