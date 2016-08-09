'use strict';

export function getProtocolByHost(host: string) {
    let protocol = 'http';
    if (/^www|csgpro|csgnext/.test(host)) {
        protocol = 'https';
    }
    return protocol;
}