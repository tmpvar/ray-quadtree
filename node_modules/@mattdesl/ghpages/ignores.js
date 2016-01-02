#!/usr/bin/env node
// Modifies .gitignore to remove bundle.js
var fs = require('fs')
var path = require('path')

var cwd = process.cwd()
var ignores = path.resolve(cwd, '.gitignore')

fs.readFile(ignores, 'utf8', function (err, data) {
  if (err) {
    console.error('No .gitignore found to modify, skipping.')
    process.exit(0)
  }
  data = data.replace(/^bundle.js[\n\r]?/gm, '')
  fs.writeFile(ignores, data, function (err) {
    if (err) {
      console.error('Could not modify .gitignore')
      throw err
    }
  })
})
