const nodemailer = require('nodemailer');
const config = require('../configs/config.json');
const Promise = require('promise');
const fs = require('fs');
const path = require('path');

exports.sendEmail = function(emailContent, template) {

    let readMailTemplate = function() {
        return new Promise((resolve, reject) => {
            let readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/' + template, 'utf8');
            let data = ''
            readStream.on('data', function(chunk) {
                data += chunk;
            }).on('end', function() {
                resolve(data);
            });
        })
    }

    let replaceContent = function() {
        return new Promise((resolve, reject) => {
            let substitution = emailContent.substitution;
        })
    }
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: config.email.username,
               pass: config.email.password
        }
    });

    // let mailOptions = {
    //     from: config.email.FORM,
    //     to: emailContent.recipients.join(';'),
    //     subject: emailContent.subject,
    //     html: '<p>Your html here</p>'
    // };

    // transporter.sendMail(mailOptions, function (err, result) {
    //     //Logger
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         console.log(result)
    //     }
    // });

    readMailTemplate()
    .then(result => {
        return replaceContent(result);
    })
};