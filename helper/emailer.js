const nodemailer = require('nodemailer');
const config = require('../configs/config.json');
exports.sendEmail = function(emailContent) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: config.email.username,
               pass: config.email.password
        }
    });

    let mailOptions = {
        from: config.email.FORM,
        to: emailContent.recipients.join(';'),
        subject: 'Test', // Subject line
        html: '<p>Your html here</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, result) {
        //Logger
        if(err) {
            console.log(err);
        } else {
            console.log(result)
        }
    });
};