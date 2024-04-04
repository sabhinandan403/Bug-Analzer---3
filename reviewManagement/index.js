/**
 * Project Name: Bug Analyzer
 * @project Review Management
 * @author Abhinandan Kumar
 * @date Mar 26, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Index file to call API to show review pages.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By            Modified On          Description
 * Abhinandan Kumar       Mar 26, 2024         Initially Created
 * 
 * -----------------------------------------------------------------------------------
 */


let Express = require('express');
var router = Express.Router();
var reviewController = require('./reviewController')


/* router to show view review screen according to usertype i.e if user is project manager then all reviews, if usertype is TL then all reviews based on reviewer name join with reviewer name
 and if usertype is developer then on the basis of the reviewer name
 */
//router.get('/viewReview', reviewController.ViewReview)


// router to get review type i.e TCD review or Code review
router.get('/getReviewType',reviewController.GetReviewType)


// router to get developers from developer_master and project_master table on the basis of username and usertype
router.get('/getDeveloperName/:usertype/:username', reviewController.GetDeveloperName)


// router to get the review category
router.get('/getReviewCategory', reviewController.GetReviewCategory)

// router to get the project name
router.get('/getProjectName/:username/:usertype', reviewController.GetProjectName)


// router to post review points in the review_master
router.post('/addReviewPoints', reviewController.AddReviewPoints)

// router to get the all the review points from the review_master table based on the reviewer name
router.get('/getReviewPoints/:username', reviewController.GetReviewPoints)


// router to get review details from the review_master table using the wrike id
router.get('/getReviewDetails/:wrikeId/:reviewType', reviewController.GetReviewDetails)

// router to delete review details from the review_master table using the wrike id
router.delete('/deleteReview/:wrikeId', reviewController.DeleteReview)

// router to delete review point from the review_master table using the wrike id
router.put('/removeReviewPoint/:wrikeId', reviewController.DeleteReviewPoint)

// router to update review point from the review_master table using the wrike id
router.put('/updateReviewPoint/:wrikeId', reviewController.UpdateReviewPoint)

// router to get review point for developer from the review_master table using the developer name
router.get('/getMyReview/:username/:usertype', reviewController.GetMyReview)

// router to get review point for developer from the review_master table using the developer name
router.get('/getMyReviewDetails/:wrikeId/:reviewType', reviewController.GetMyReviewPointsDetails)

// router to update review point for developer from the review_master table using the developer name
router.put('/updateDeveloperReviewPoint/:wrikeId', reviewController.UpdateDeveloperReviewPoint)

// router to get review status for dropdown for My Review modal screen from review_status_master
router.get('/getReviewStatus', reviewController.GetReviewStatus)

module.exports = router

