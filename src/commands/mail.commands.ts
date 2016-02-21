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

export function sendContactFormEmail(formData: IContactFormData, subject = 'Contact Form Submission') {
    let promise = new Promise<nodemailer.SentMessageInfo>((resolve, reject) => {
        
        let errors: { prop: string; error: string; }[] = [];
        
        if (!formData.name) {
            errors.push({ prop: 'name', error: 'required' });
        }
        
        if (!formData.note) {
            errors.push({ prop: 'note', error: 'required' });
        }
        
        if (!formData.email && !formData.phone) {
            errors.push({ prop: 'phone', error: 'required if email is not provided'});
            errors.push({ prop: 'email', error: 'required if phone is not provided'});
        }
        
        if (formData.email && !validEmailAddress(formData.email)) {
            errors.push({ prop: 'email', error: 'email address is invalid'});
        }
        
        if (errors.length) {
            reject({ errors });
        }
    
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
}

function validEmailAddress(emailAddress: string): boolean {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(emailAddress);
}