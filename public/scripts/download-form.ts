declare var window: any;

import * as $ from 'jquery';

const downloadModal = $('#downloadModal');
const downloadForm = $('#downloadModal form');
const callout = downloadForm.find('.callout');

let filePath: string;

downloadModal.on('closed.zf.reveal', () => {
    resetCallout();
    resetForm();
});

function resetForm() {
    const name = downloadForm.find('[name="name"]').val('');
    const phone = downloadForm.find('[name="phone"]').val('');
    const email = downloadForm.find('[name="email"]').val('');
    const company = downloadForm.find('[name="company"]').val('');
}

function resetCallout() {
    callout.removeClass('success warning alert').addClass('hide');
}

window.openDownloadModal = function openDownloadModal(fp: string) {
    filePath = fp;
    downloadModal.foundation('open');
};

window.submitDownloadForm = function submitDownloadForm() {
    const name = downloadForm.find('[name="name"]').val();
    const phone = downloadForm.find('[name="phone"]').val();
    const email = downloadForm.find('[name="email"]').val();
    const company = downloadForm.find('[name="company"]').val();
    
    resetCallout();
    
    if (!(name && email)) {
        callout.addClass('warning').removeClass('hide').html('<h5>We need your name and email address.</h5>');
        return;
    }
    
    $.ajax('/download/request', { type: 'POST', data: { name, phone, email, company, filePath } }).done((res) => {
        callout.addClass('success').removeClass('hide').html('<h5>Thank you! Check your email to access your download.</h5>');
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
    
};