const router = require("express").Router();
const path = require("path");
const File = require("../models/file");


router.get("/:uuid", async (req,res)=>{

    try{

        const file = await File.findOne({uuid:req.params.uuid});
        if(!file){
            return res.render("download",{err:"Link has benn expired"});
        }
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    }catch{
        return res.render("download",{err : "Something went wrong"});
    }
});

module.exports = router;