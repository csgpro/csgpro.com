'use strict';

declare var window: any;

import $ = require('jquery');

const contactForm = $('#contactModal form');
const callout = contactForm.find('.callout');

$('#contactModal').on('closed.zf.reveal', () => {
    resetCallout();
    resetForm();
});

function resetForm() {
    const name = contactForm.find('[name="name"]').val('');
    const phone = contactForm.find('[name="phone"]').val('');
    const email = contactForm.find('[name="email"]').val('');
    const note = contactForm.find('[name="note"]').val('');
}

function resetCallout() {
    callout.removeClass('success warning alert').addClass('hide');
}

window.submitContactForm = function submitContactForm() {
    const name = contactForm.find('[name="name"]').val();
    const phone = contactForm.find('[name="phone"]').val();
    const email = contactForm.find('[name="email"]').val();
    const note = contactForm.find('[name="note"]').val();
    
    resetCallout();
    
    if (!(name && email && note)) {
        callout.addClass('warning').removeClass('hide').html('<h5>We need your name, email address and some information about what you need.</h5>');
        return;
    }
    
    $.ajax('/contact', { type: 'POST', data: { name, phone, email, note } }).done((res) => {
        callout.addClass('success').removeClass('hide').html('<h5>Thank you! We\'ll be in touch soon.</h5>');
        resetForm();
    }).fail((err) => {
        let data = err.responseJSON;
        let html = `<h5>${(data.errors && data.errors.length > 1) ? 'Errors Occured' : 'An Error Occured' }</h5>`;
        if (data.errors && data.errors.length) {
            html += '<ul>';
                data.errors.forEach((error: { title: string }) => {
                    html += `<li>${error.title}</li>`;
                });
            html += '</ul>';
        } else {
            html += `<p>${data.error}</p>`;
        }
        callout.addClass('alert').removeClass('hide').html(html);
    });
    
}