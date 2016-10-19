'use strict';

export function getProtocolByHost(host: string): 'http'|'https' {
    if (/^(www|csgpro)/.test(host)) return 'https';
    return 'http';
}