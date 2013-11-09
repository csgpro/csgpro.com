var azure = require('azure');
var c = require('nconf');

// Load config files
c.env().file({ file: 'config.json'});

var storageAccount = c.get('AZURE_STORAGE_ACCOUNT');
var accessKey = c.get('AZURE_STORAGE_ACCESS_KEY');
var blobContainer = 'img';
var blobBaseUrl = 'https://csgsitestorage.blob.core.windows.net/' + blobContainer;

var blobService = azure.createBlobService(storageAccount, accessKey);

// blobService.listBlobs('img', function(err, blobs){
//   if(!err) {
//     console.dir(blobs);
//   } else {
//     console.log(err);
//   }
// });

// fileExtension should not include a `.`
module.exports.uploadImage = function(filePath, fileExtension, callback) {
  var now = Date.now();
  var azureFileName = now + '.' + fileExtension;

  // I am unsure if this will work on Azure because I don't know how file
  // storage works on Azure
  blobService.createBlockBlobFromFile(
    blobContainer,
    azureFileName,
    filePath,
    function(err, blockBlog, response){
      if(!err)
        callback(null, blobBaseUrl + '/' + azureFileName);
      if(err)
        callback(err)
    }
  );
}
