const nodemailer = require("nodemailer");
async function sendMail({from , to , subject , text ,html}){
    let transporter = nodemailer.createTransport({
        service:process.env.SMTP_SERVICE,
        // host : process.env.SMTP_HOST,
        // port :process.env.SMTP_PORT,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    });

    try {
        let info = await transporter.sendMail({
 
            from : `inShare <${from}>`,
            to,
            subject,
            text,
            html
        });
        // console.log(info);    
    } catch (error) {
       console.log(error);
        
    }
    
}
module.exports = sendMail;