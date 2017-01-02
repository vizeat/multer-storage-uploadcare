import test from 'ava'
import nock from 'nock'
import fs from 'fs'
import uploadcareStorage from '../index'

const ucStorage = uploadcareStorage({
  public_key: 'toto',
  private_key: 'tata',
  store: 'auto'
})

let file

test.beforeEach(t => {
  file = {
    filename: 'osi.png',
    mimetype: 'image/png',
    stream: fs.createReadStream('./test/osi.png')
  }
})

test.afterEach(t => {
  nock.cleanAll()
})

test('Configuration', t => {
  t.is(ucStorage.options.public_key, 'toto')
  t.is(ucStorage.options.private_key, 'tata')
  t.is(ucStorage.options.store, 'auto')
})

test.cb('successful upload', t => {
  let upload = nock('https://upload.uploadcare.com')
    .post('/base/')
    .reply(201, { file: 'my_awesome_uuid' })

  t.plan(2)
  ucStorage._handleFile(null, file, (err, res) => {
    t.truthy(upload.isDone())
    t.is(res.uploadcare_file_id, 'my_awesome_uuid')
    t.end()
  })
})

test.cb('failed upload', t => {
  let upload = nock('https://upload.uploadcare.com')
    .post('/base/')
    .replyWithError('something awful happened')

  t.plan(2)
  ucStorage._handleFile(null, file, (err, res) => {
    t.truthy(upload.isDone())
    t.is(err.message, 'something awful happened')
    t.end()
  })
})

test.cb('successful remove', t => {
  file.uploadcare_file_id = 'my_awesome_uuid'
  let api = nock('https://api.uploadcare.com')
    .delete('/files/my_awesome_uuid')
    .reply(200, file)

  t.plan(4)
  ucStorage._removeFile(null, file, (err, res) => {
    t.truthy(api.isDone())
    t.is(res.uploadcare_file_id, 'my_awesome_uuid')
    t.is(res.filename, file.filename)
    t.is(res.mimetype, file.mimetype)
    t.end()
  })
})

test.cb('failed remove', t => {
  file.uploadcare_file_id = 'my_awesome_uuid'
  let api = nock('https://api.uploadcare.com')
    .delete('/files/my_awesome_uuid')
    .replyWithError('something awful happened')

  t.plan(2)
  ucStorage._removeFile(null, file, (err, res) => {
    t.truthy(api.isDone())
    t.is(err.message, 'something awful happened')
    t.end()
  })
})
