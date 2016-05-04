var _ = require('lodash')
var request = require('request')

function UploadcareStorage (opts) {
  this.options = {
    public_key: null,
    store: 1
  }

  _.assign(this.options, opts)
}

UploadcareStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  var formData = {
    UPLOADCARE_PUB_KEY: this.options.public_key,
    UPLOADCARE_STORE: this.options.store,
    file: {
      value: file.stream,
      options: {
        filename: file.filename,
        contentType: file.mimetype,
        knownLength: req.headers['content_length']
      }
    }
  }

  request.post({
    url: 'https://upload.uploadcare.com/base/',
    formData: formData
  }, function _callback (err, httpResponse, body) {
    if (err) {
      console.error('upload failed:', err)
      return cb(err)
    }
    console.log('Upload successful!  Server responded with:', body)
    return cb(null, body)
  })
}

UploadcareStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  // TODO: implement
  console.log('delete', file)
  cb(null, {})
}

module.exports = function (opts) {
  return new UploadcareStorage(opts)
}
