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

    let replaceContent = function(template) {
        return new Promise((resolve, reject) => {
            let substitution = emailContent.substitution;
            for(key in substitution) {
                template = template.replace(key, substitution[key]);
            }
            resolve(template);
        })
    }

    let sendEmail = function(template) {
        return new Promise((resolve, reject) => {
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
                subject: emailContent.subject,
                html: template
            };
            
            transporter.sendMail(mailOptions, function (err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })
    }

    readMailTemplate()
    .then(result => {
        return replaceContent(result);
    }).then(result => {
        return sendEmail(result);
    }).then(response => {
        //Loggger
        console.log(response);
    }).catch(err => {
        console.log(err);
    })
};