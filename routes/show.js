const router = require("express").Router();
const path = require("path");
const File = require("../models/file");



router.get("/:uuid", async(req,res)=>{

    try {
        const uuid = req.params.uuid;
        const file = await File.findOne({uuid});    
        if(!file){
            return res.render("download", { err: "Link has been expired"});    
        }
        return res.render("download",{

            fileName : file.filename,
            uuid: file.uuid,
            fileSize : file.size,
            downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            // localhost://27017:3000/files/download/bcf8ba7e-7682-4c86-98f5-00e4e5ee9d76
        });
    } catch (error) {
        return res.render("download", { err: "Something Went Wrong"});
    }
});

module.exports = router;