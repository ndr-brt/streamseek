module.exports = results => Object.values(
      results.reduce(groupByFolder, {})
    )
    .filter(it => it.slots)
    .filter(f => f.songs.length > 0)
    .sort((a, b) => b.speed - a.speed)

let groupByFolder = (acc, it) => {
  let descriptor = fileDescriptor(it.file)
  var folder = acc[descriptor.folder] || newFolder(descriptor.folder, it)

  let file = {
    key: Buffer.from(it.user + '|' + it.file).toString('base64'),
    file: it.file,
    size: it.size,
    bitrate: it.bitrate,
    name: descriptor.name
  }

  if (descriptor.extension === 'mp3' || descriptor.extension === 'm4a' || descriptor.extension === 'flac') {
    folder.songs.push(file)
  } else if (descriptor.extension === 'jpg' || descriptor.extension === 'jpeg' || descriptor.extension === 'png') {
    folder.images.push(file)

    var smallestImage = folder.images.sort((a, b) => b.size - a.size)[0]
    folder.cover = smallestImage.key
  } else {
    folder.files.push(file)
  }

  acc[descriptor.folder] = folder

  return acc;
}

let newFolder = (folderName, firstFile) => {
  return {
    name: folderName,
    user: firstFile.user,
    speed: firstFile.speed,
    slots: firstFile.slots,
    songs: [],
    images: [],
    files: []
  }
}

let fileDescriptor = file => {
  let lastSlash = file.lastIndexOf('\\')
  let lastDot = file.lastIndexOf('.')
  return {
    folder: file.substr(0, lastSlash),
    name: file.substr(lastSlash + 1),
    extension: file.substr(lastDot + 1),
  }
}
