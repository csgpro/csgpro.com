'use strict';

declare var window: any;

import * as $ from 'jquery';

function resetForm(container: JQuery) {
    const name = container.find('[name="name"]').val('');
    const phone = container.find('[name="phone"]').val('');
    const email = container.find('[name="email"]').val('');
    const note = container.find('[name="note"]').val('');
}

function resetCallout(callout: JQuery) {
    callout.removeClass('success warning alert').addClass('hide');
}

window.submitContactForm = function submitContactForm(target: string) {
    const container = $(target);

    const callout = container.find('.callout');

    const name = container.find('[name="name"]').val();
    const phone = container.find('[name="phone"]').val();
    const email = container.find('[name="email"]').val();
    const note = container.find('[name="note"]').val();

    // Reset values if modal is closed (assuming container is a modal)
    container.on('closed.zf.reveal', () => {
        resetCallout(callout);
        resetForm(container);
    });
    
    resetCallout(callout);
    
    if (!(name && email && note)) {
        callout.addClass('warning').removeClass('hide').html('<h5>We need your name, email address and some information about what you need.</h5>');
        return;
    }
    
    $.ajax('/contact', { type: 'POST', data: { name, phone, email, note } }).done((res) => {
        callout.addClass('success').removeClass('hide').html('<h5>Thank you! We\'ll be in touch soon.</h5>');
        resetForm(container);
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