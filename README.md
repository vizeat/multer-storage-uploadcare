# multer-storage-uploadcare
[![Build Status](https://travis-ci.org/vizeat/multer-storage-uploadcare.svg?branch=master)](https://travis-ci.org/vizeat/multer-storage-uploadcare) [![codecov](https://codecov.io/gh/vizeat/multer-storage-uploadcare/branch/master/graph/badge.svg)](https://codecov.io/gh/vizeat/multer-storage-uploadcare) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![npm version](https://badge.fury.io/js/multer-storage-uploadcare.svg)](https://badge.fury.io/js/multer-storage-uploadcare) [![Dependency Status](https://david-dm.org/vizeat/multer-storage-uploadcare.svg)](https://david-dm.org/vizeat/multer-storage-uploadcare)

An Uploadcare storage engine for multer

## Installation

`npm i --save multer-storage-uploadcare`

## Usage

```javascript
'use strict'

const uploadcareStorage = require('multer-storage-uploadcare')
const multer = require('multer', {
  storage: uploadcareStorage({
    public_key: YOUR_UPLOADCARE_PRIVATE_KEY,
    private_key: YOUR_UPLOADCARE_PUBLIC_KEY
    store: 'auto' // 'auto' || 0 || 1
  })
})

```

