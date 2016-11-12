// libs
import * as chai from 'chai';

// app
import { slugify } from './helpers';

const expect = chai.expect;

describe('slugify', () => {
    it('should replace spaces with hyphens', () => {
        return expect(slugify('My Simple Title')).to.equal('my-simple-title');
    });

    it('should gracefully remove apostrophes', () => {
        return expect(slugify('What\'s My Name')).to.equal('whats-my-name');
    });

    it('should remove trailing punctuation', () => {
        return expect(slugify('How\'s it going?')).to.equal('hows-it-going');
    });

    it('should not have more than one hyphen in a row', () => {
        return expect(slugify('this should - work')).to.equal('this-should-work');
    });

    it('should replace forward and backword slashes with hyphens', () => {
        return expect(slugify('thing one/thing two - meet\\thing three')).to.equal('thing-one-thing-two-meet-thing-three');
    });

    it('should retain existing hyphens', () => {
        return expect(slugify('867-5309/Jenny')).to.equal('867-5309-jenny');
    });
});