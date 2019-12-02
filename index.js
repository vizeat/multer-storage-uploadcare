const request = require('request')
const concat = require('concat-stream')

function UploadcareStorage (opts) {
  this.options = {
    public_key: null,
    private_key: null,
    store: 'auto'
  }
  Object.assign(this.options, opts)
}

UploadcareStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  file.stream.pipe(concat((fileBuffer) => {
    request.post({
      url: 'https://upload.uploadcare.com/base/',
      json: true,
      formData: {
        UPLOADCARE_PUB_KEY: this.options.public_key,
        UPLOADCARE_STORE: this.options.store,
        file: {
          value: fileBuffer,
          options: {
            filename: file.originalname,
            contentType: file.mimetype
          }
        }
      }
    }, function _createCallback (err, httpResponse, body) {
      if (err) return cb(err)
      return cb(null, { uploadcare_file_id: body.file })
    })
  }))
}

UploadcareStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  request.delete({
    url: `https://api.uploadcare.com/files/${file.uploadcare_file_id}`,
    Authorization: `Uploadcare.Simple ${this.options.public_key}:${this.options.private_key}`,
    json: true
  }, function _deleteCallback (err, httpResponse, body) {
    if (err) return cb(err)
    return cb(null, body)
  })
}

module.exports = function (opts) {
  return new UploadcareStorage(opts)
}
