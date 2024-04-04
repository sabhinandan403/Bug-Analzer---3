/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Index file to call API to show webpages.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 01, 2024        Added routes for user.
 * -----------------------------------------------------------------------------------
 */

let Express =require('express');
var router=Express.Router();

router.get('/addBug', (req,res)=>{
    res.render('AddBugInfo');
});

router.get('/',(req,res)=>{
    res.render('AdminLogin');
})

router.get('/userLogin', (req,res)=>{
    res.render('UserLogin');
})

router.get('/addUser',(req,res)=>{
    res.render('AddUser');
})

router.get('/getAllBugsInfo', (req, res) => {
    res.render('GetAllBugsInfo'); 
});

router.get('/projectBugsInfo', (req, res) => {
    res.render('ProjectBugsInfo'); 
});

router.get('/assignedBugs',(req, res) => {
    res.render('AssignedBugs'); 
})

router.get('/editBug',(req, res) => {
    res.render('EditBug'); 
})

// Add Review Management Screens, 26/03/2024, Abhinandan Kumar - Start
router.get('/addReview',(req, res) => {
    res.render('addReview'); 
})

router.get('/viewReview',(req, res) => {
    res.render('viewReview');
})

router.get('/reviewDetail', (req, res) =>{
    res.render('reviewDetail');
})


router.get('/myReview', (req, res) =>{
    res.render('MyReview');
})

router.get('/myReviewDetails', (req, res) =>{
    res.render('MyReviewDetails');
})




module.exports = router