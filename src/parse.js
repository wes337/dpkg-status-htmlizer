export default function parseDpkg(statusFile) {
  const packagesArray = statusFile.split('\n\n')
  const packagesObjects = []

  packagesArray.forEach((packageItem) => {
    const packageObject = {}
    const packageLines = packageItem.split('\n')

    packageLines.forEach(line => {
      const keys = line.match(/(^[\w:]+):\s(.+)/)
      if (keys && keys.length >= 3) {
        const keyName = keys[1].toLowerCase()
        const keyValue = keys[2]
        packageObject[keyName] = keyValue
      }
    })
    packagesObjects.push(packageObject)
  })

  packagesObjects.sort((a, b) => {
    if (a.package < b.package) {
      return -1
    }
    if (a.package > b.package) {
      return 1
    }
    return 0
  })

  return packagesObjects.filter(packageItem => packageItem.package && packageItem.package.length > 0)
}
