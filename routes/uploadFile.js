const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid")


// Stroage code in uploads folder

const storage = multer.diskStorage({

    destination: (req, file, cd) => {
        cd(null, 'uploads/');
    },
    filename: (req, file, cd) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cd(null, uniqueName);
    }
});

// Upload code
const upload = multer({

    storage: storage,
    limits: { fileSize: 1000000 * 100 } 
    // bites ::: 1 Mb === 1000000 bites
}).single("myFile");


router.post("/", (req, res) => {


    // Store the file
    upload(req, res, async (err) => {

        // Validate the file request
        if (!req.file) {
            return res.json({ error: "All fields are requires" });
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }

        // Storage in database

        try {
        
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            });
    
            const response = await file.save();
            return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    
        } catch (error) {
            return res.send(error);            
        }
                // return res.render("download");
    });

    // Store into Database


    // Response the Download link to the client

});

router.post("/send", async(req,res)=>{

    const { uuid , emailTo , emailFrom } = req.body;

    
    // Validate a request

    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({error : "All fields are require"});
    }
    
    try {

        const file = await File.findOne({uuid:uuid});
        
        // if(file.sender){
        //     return res.status(422).send({error:"Email All Ready Sent"});
        // }
        file.sender = emailFrom;
        file.receiver = emailTo;
    
        const response = await file.save();
        // console.log(response);
        
        // Send Gmail

        const sendMail = require("../services/emailSend");
        
        sendMail({
            from : emailFrom,
            to : emailTo,
            subject : "inShare file sharing",
            text : `${emailFrom} shared a file with you`,
            html :require("../services/emailTemplate")({
                emailFrom : emailFrom,
                downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size : parseInt(file.size/1000) +' KB',
                expires:"24 Hours"
            })
        });
        return res.send({success:"Mail Sent"})
    } catch (error) {
        return res.status(403).send(error);
    }
})
module.exports = router;

