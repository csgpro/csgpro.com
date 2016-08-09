import * as mocha from 'mocha';
import * as chai from 'chai';
const chaip = require('chai-as-promised');
import { sendContactFormEmail } from '../commands/mail.commands';

const expect = chai.expect;

chai.use(chaip);

xdescribe('sendContactFormEmail', () => {
    it('prevent invalid email address', () => {
        let promise = sendContactFormEmail({ name: 'Foo', email: 'Bar', note: 'FooBar' });
        return chai.assert.isRejected(promise, Array);
    });
});
