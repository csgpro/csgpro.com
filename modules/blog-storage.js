var azure = require('azure');
var c = require('nconf');

// Load config files
c.env().file({ file: 'config.json'});

var storageAccount = c.get('AZURE_STORAGE_ACCOUNT');
var accessKey = c.get('AZURE_STORAGE_ACCESS_KEY');

console.log(storageAccount, accessKey);

var blobService = azure.createBlobService(storageAccount, accessKey);

blobService.listBlobs('img', function(err, blobs){
  if(!err) {
    console.dir(blobs);
  } else {
    console.log(err);
  }
});


blobService.createBlockBlobFromFile('img',
  'footer_bg.png',
  './public/img/footer_bg.png',
  function(err){
    if(!err) 
      console.log('File uploaded...');
  }
);