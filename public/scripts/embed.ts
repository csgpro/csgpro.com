'use strict';

import *  as powerbi from 'powerbi-client';


var embedToken = '';

let embedDiv = $('#embedDiv');

var config = {
    type: 'report',
    tokenType: powerbi.models.TokenType.Embed,
    accessToken: embedToken,
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=4d0f1ee2-0ead-45b0-9207-d29970d09e15&groupId=7b312a6c-8e46-4b85-88c0-c0fcb051a189',
    id: '4d0f1ee2-0ead-45b0-9207-d29970d09e15',
    settings: {
        filterPaneEnabled: "False",
        navContentPaneEnabled: "True"
    }
};

// Embed the report within the div element
//var report = powerbi.embed(embedDiv, config);
//powerbi.embed(embedDiv, config);

// var accessToken = "xxx";
// let reportId = "5ffe6cb1-2eb1-4f78-9b74-08a4e25e1a67";
// let embedUrl = "https://app.powerbi.com/reportEmbed?reportId=5ffe6cb1-2eb1-4f78-9b74-08a4e25e1a67&groupId=97e74db8-81ff-46dc-8332-d9f578fbaaad";
// let embedDiv = $('#embedDiv');
    
// let config: powerbi.IEmbedConfiguration = {
//     type: "report",
//     tokenType: powerbi.models.TokenType.Embed,
//     accessToken: {accessToken},
//     embedUrl: embedUrl,
//     id: reportId,
//     settings: {
//         filterPaneEnabled: true,
//         navContentPaneEnabled: true
//     }
// };

// if (embedDiv != null) {
//     var pbi = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory, powerbi.factories.routerFactory);
//     pbi.embed(embedDiv[0], config);
// }
