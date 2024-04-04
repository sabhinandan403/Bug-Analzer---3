/* eslint-disable no-undef */
/**
 * Project Name: Bug Analyzer
 * @project Review Management
 * @author Abhinandan Kumar
 * @date Mar 26, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Controller file for review routes
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By            Modified On            Description
 * Abhinandan Kumar       April 01, 2024         Initially Created
 * 
 * -----------------------------------------------------------------------------------
 */

const reviewService = require("./reviewService");
// const middleware=require("../common/middleware/GenerateToken");
const messages = require("../common/messages/Messages");
const constants = require("../common/config/Constants");


/**
 * @description To send view review screen on the basis of usertype
 * @param  {} req
 * @param  {} res
 */



/**
 * @description To get review type from the database
 * @param  {} req
 * @param  {} res
 */

exports.GetReviewType = async function (req, res) {

    try {
        var result = await reviewService.GetReviewType()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            res.status(404).json({
                success: false, message: messages.DATA_NOT_FOUND
            })
        }
    } catch (error) {
        logger.error(messages.DATA_NOT_FOUND)
        console.log('Get review category error', error)
        res.status(500).json({ success: false, messages: messages.DATA_NOT_FOUND })
    }
}

/**
 * @description To get developer name from the database
 * @param  {} req
 * @param  {} res
 */

exports.GetDeveloperName = async function (req, res) {

    var { username, usertype } = req.params
    if (!username || !usertype) {
        res.status(400).json({ success: false, message: messages.REQUEST_PARAMS_NOT_FOUND });
    }

    try {
        var result = await reviewService.GetDeveloperName(username, usertype);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            res.status(404).json({ success: false, message: messages.DATA_NOT_FOUND })
        }
    } catch (error) {
        logger.error(messages.GET_DEVELOPER_NAME_ERROR)
        console.log('Error while fetiching developer name :', error)
        res.status(500).json({ success: false, message: messages.INTERNAL_SERVER_ERROR })
    }
};

/**
 * @description To get project name from the database
 * @param  {} req
 * @param  {} res
 */

exports.GetProjectName = async function (req, res) {
    var { username, usertype } = req.params;
    if (!usertype || !username) {
        return res.status(400).json({ success: false, message: messages.REQUEST_PARAMS_NOT_FOUND })
    }

    try {
        var result = await reviewService.GetProjectName(username, usertype)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })

        } else {
            res.status(404).json({ success: false, message: messages.DATA_NOT_FOUND })
        }
    } catch (error) {
        logger.error(messages.GET_PROJECT_NAME_FAILURE)
        console.log('Error while fetching project name :', error)
        res.status(500).json({ success: false, message: messages.INTERNAL_SERVER_ERROR })
    }

};

/**
 * @description To get reiew category from the database
 * @param  {} req
 * @param  {} res
 */

exports.GetReviewCategory = async function (req, res) {
    try {
        var result = await reviewService.GetReviewCategory()
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })

        } else {
            res.status(404).json({ success: false, message: messages.DATA_NOT_FOUND })
        }
    } catch (error) {
        logger.error(messages.GET_REVIEW_CATEGORY_FAILURE)
        console.log('Error fetching review category :', error)
        res.status(500).json({ success: false, message: messages.GET_REVIEW_CATEGORY_FAILURE })
    }
}

/**
 * @description To add review points in the database
 * @param  {} req
 * @param  {} res
 */

exports.AddReviewPoints = async function (req, res) {

    if (!req.body) {
        res.status(400).json({ success: false, message: messages.BAD_REQUEST })
    }

    try {
        var result = await reviewService.AddReviewPoints(req.body)
        if (result.success) {
            res.status(200).json({ success: true, message: messages.ADD_REVIEW_SUCCESS })
        } else {
            res.status(400).json({ success: false, message: messages.ADD_REVIEW_FAILURE })
        }
    } catch (error) {
        logger.error(messages.INTERNAL_SERVER_ERROR)
        console.log('Error adding review points :', error)
        res.status(404).json({ success: false, message: messages.INTERNAL_SERVER_ERROR })
    }



};


/**
 * @description To get review points from the review_master table using thr reviewer name
 * @param  {} req
 * @param  {} res
 */

exports.GetReviewPoints = async function (req, res) {
    var reviewerName = req.params.username
    if (!reviewerName) {
        res.status(400).json({ success: false, message: messages.BAD_REQUEST })
    }

    try {
        var result = await reviewService.GetReviewPoints(reviewerName)
        if (result.success) {
            res.status(200).json({ success: true, data: result.data })
        } else {
            res.status(404).json({ success: false, message: messages.DATA_NOT_FOUND })
        }
    } catch (error) {
        console.log('Error fetuching review points :', error)
        logger.error(messages.GET_REVIEW_POINTS_FAILURE)
        res.status(500).json({ success: false, message: messages.INTERNAL_SERVER_ERROR })
    }
}

/**
 * @description To get review details from the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */
exports.GetReviewDetails = async function (req,res) {  
    var wrikeId = req.params.wrikeId
    var reviewType = req.params.reviewType
    if(!wrikeId){
        res.status(400).json({success:false,message:messages.BAD_REQUEST})
    }

    try{
        var result = await reviewService.GetReviewDetails(wrikeId,reviewType)
        if(result.success){
            res.status(200).json({success:true,data:result.data})
        }else{
            res.status(404).json({success:false,messages:messages.DATA_NOT_FOUND})
        }
    }catch(error){
        console.log('Error fetching review details :',error)
        logger.error(messages.GET_REVIEW_DETAILS_FAILURE)
        res.status(500).json({success:false,messages:messages.INTERNAL_SERVER_ERROR})
    }
}

/**
 * @description To remove review details from the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */

exports.DeleteReview = async function(req,res){
    var wrikeId = req.params.wrikeId
    if(!wrikeId){
        res.status(400).json({success:false,messages:messages.BAD_REQUEST})
    }

    try{
        var result = await reviewService.DeleteReview(wrikeId)
        if(result.success){
            res.status(200).json({success:true,messages:messages.REVIEW_REMOVE_SUCCESSFUL})
        }else{
            res.status(409).json({success:false,messages:messages.REVIEW_REMOVE_FAILURE})
        }
    }catch(error){
        console.log('Error while removing review :',error)
        logger.error(messages.INTERNAL_SERVER_ERROR)
        res.status(500).json({success:false,messages:messages.INTERNAL_SERVER_ERROR})
    }
}

/**
 * @description router to delete review points from the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */

exports.DeleteReviewPoint = async function(req, res){
    var wrikeId = req.params.wrikeId
    if(!wrikeId || !req.body){
        return res.status(400).json({success:false, messages:messages.BAD_REQUEST});
    }

    try{
        var result = await reviewService.DeleteReviewPoint(wrikeId, req.body);
        if(result.success){
            return res.status(200).json({success:true, data:result.data});
        } else {
            return res.status(404).json({ success: false , messages: messages.DELETE_REVIEW_POINT_FAILURE});
        }
    }catch(error){
        console.log('Error deleting review point :', error);
        logger.error(messages.INTERNAL_SERVER_ERROR);
        return res.status(500).json({success:false, messages:messages.INTERNAL_SERVER_ERROR});
    }
}

/**
 * @description router to update review points from the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */

exports.UpdateReviewPoint = async function(req, res){
    var wrikeId = req.params.wrikeId
    if(!wrikeId || !req.body){
        return res.status(400).json({success:false, messages:messages.BAD_REQUEST});
    }

    try{
        var result = await reviewService.UpdateReviewPoint(wrikeId, req.body);
        if(result.success){
            return res.status(200).json({success:true, data:result.data});
        } else {
            return res.status(404).json({ success: false , messages: messages.DELETE_REVIEW_POINT_FAILURE});
        }
    }catch(error){
        console.log('Error deleting review point :', error);
        logger.error(messages.INTERNAL_SERVER_ERROR);
        return res.status(500).json({success:false, messages:messages.INTERNAL_SERVER_ERROR});
    }
}

/**
 * @description router to get review points for developer from the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */

exports.GetMyReview = async function(req, res){
    var username = req.params.username
    var usertype = req.params.usertype
    if(!usertype === constants.DEVELOPER ){
        return res.status(400).json({success:false, messages:messages.BAD_REQUEST});
    }

    try{
        var result = await reviewService.GetMyReview(username);
        if(result.success){
            return res.status(200).json({success:true, data:result.data});
        } else {
            return res.status(404).json({ success: false , messages: messages.GET_REVIEW_POINTS_FAILURE});
        }
    }catch(error){
        console.log('Error deleting review point :', error);
        logger.error(messages.INTERNAL_SERVER_ERROR);
        return res.status(500).json({success:false, messages:messages.INTERNAL_SERVER_ERROR});
    }
}

/**
 * @description router to get review points details for developer from the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */

exports.GetMyReviewPointsDetails = async function(req, res){
    var wrikeId = req.params.wrikeId
    var reviewType = req.params.reviewType
    if(!wrikeId || !reviewType  ){
        return res.status(400).json({success:false, messages:messages.BAD_REQUEST});
    }

    try{
        var result = await reviewService.GetMyReviewPointsDetails(wrikeId,reviewType);
        if(result.success){
            return res.status(200).json({success:true, data:result.data});
        } else {
            return res.status(404).json({ success: false , messages: messages.GET_REVIEW_DETAILS_FAILURE});
        }
    }catch(error){
        console.log('Error deleting review point :', error);
        logger.error(messages.INTERNAL_SERVER_ERROR);
        return res.status(500).json({success:false, messages:messages.INTERNAL_SERVER_ERROR});
    }
}

/**
 * @description router to update review points details by developer in the review_master table using the wrike id
 * @param  {} req
 * @param  {} res
 */

exports.UpdateDeveloperReviewPoint = async function(req, res){
    var wrikeId = req.params.wrikeId
    
    if(!wrikeId || !req.body ){
        return res.status(400).json({success:false, messages:messages.BAD_REQUEST});
    }

    try{
        var result = await reviewService.UpdateDeveloperReviewPoints(wrikeId,req.body);
        if(result.success){
            return res.status(200).json({success:true, data:result.data});
        } else {
            return res.status(404).json({ success: false , messages: messages.UPDATE_REVIEW_DETAILS_FAILURE});
        }
    }catch(error){
        console.log('Error deleting review point :', error);
        logger.error(messages.INTERNAL_SERVER_ERROR);
        return res.status(500).json({success:false, messages:messages.INTERNAL_SERVER_ERROR});
    }
}

/**
 * @description router to get review status for dropdown for My Review modal screen from review_status_master
 * @param  {} req
 * @param  {} res
 */

exports.GetReviewStatus = async function(req, res){
    
    try{
        var result = await reviewService.GetReviewStatus();
        if(result.success){
            return res.status(200).json({success:true, data:result.data});
        } else {
            return res.status(404).json({ success: false , messages: messages.GET_REVIEW_STATUS_FAILURE});
        }
    }catch(error){
        console.log('Error fetching review statuses :', error);
        logger.error(messages.INTERNAL_SERVER_ERROR);
        return res.status(500).json({success:false, messages:messages.INTERNAL_SERVER_ERROR});
    }
}

