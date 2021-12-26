#!/usr/bin/env node
const StreamZip = require('node-stream-zip')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const sizeOf = require('image-size')

const doc = new PDFDocument({autoFirstPage: false, bufferPages: true})
const stream = doc.pipe(fs.createWriteStream(process.argv[3]))

const zip = new StreamZip.async({ file: process.argv[2] })
async function main() {
  const entries = await zip.entries()
  const names = Object.values(entries).map((value) => {
    return value.name
  }).sort()
  for(const name of names) {
    const data = await zip.entryData(name);
    const dim = sizeOf(data)
    doc.addPage({size: [dim.width, dim.height], margin: 0})
    doc.image(data)
  }
  doc.end()
  await zip.close()
}
main()
