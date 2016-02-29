'use strict';

import * as conf from 'nconf';
import { mailer } from '../modules/mailer';

let striptags = require('striptags');

interface IContactFormData {
    name: string;
    phone: string;
    email: string;
    note: string;
}

interface IError {
    title: string;
    detail?: string;
}

export function sendContactFormEmail(formData: IContactFormData, subject = 'Contact Form Submission') {
    return validateContactForm(formData).then(() => {
        let promise = new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
        
            const from = 'CSG Notification <noreply@csgpro.com>';
            const to = conf.get('CONTACT_FORM_EMAIL');
            
            let html = `
                ${formData.name} submitted the contact form from csgpro.com.<br>
                <br>
                Here's what they said:<br>
                <br>
                <b>What's your name?</b><br>
                ${formData.name}<br>
                <br>
                <b>What's your phone #?</b><br>
                ${formData.phone || 'Not Provided'}<br>
                <br>
                <b>What's your email address?</b><br>
                ${formData.email || 'Not Provided'}<br>
                <br>
                <b>What's on your mind?</b><br>
                ${formData.note}<br>
                <br>
            `;
            
            let text = striptags(html);
            
            mailer.sendMail({ to, from, subject, html, text }, (err, info) => {
                if (err) {
                    throw err;
                } else {
                    resolve(info);
                }
            });
        });
        return promise;
    });
}



function validateContactForm(formData: IContactFormData) {
    let promise = new Promise((resolve, reject) => {
        let errors: IError[] = [];
        
        if (!formData.name) {
            errors.push({ title: 'Name is Required' });
        }
        
        if (!formData.note) {
            errors.push({ title: 'Note is Required' });
        }
        
        if (!formData.email && !formData.phone) {
            errors.push({ title: 'Phone is Required', detail: 'Phone is required when email is not provided.'});
            errors.push({ title: 'Email is Required', detail: 'Email is required when phone is not provided.'});
        }
        
        if (formData.email && !validEmailAddress(formData.email)) {
            errors.push({  title: 'Invalid Email Address', detail: 'The email address format is not recognized.'});
        }
        
        if (errors.length) {
            throw errors;
        } else {
            resolve();
        }
    });
    return promise;
}

function validEmailAddress(emailAddress: string): boolean {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(emailAddress);
}