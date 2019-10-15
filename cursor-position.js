const { execSync, execFileSync } = require('child_process')
const path = require('path')

function mapCursorPosition() {
  const file = path.resolve(__dirname, './cursor-position.sh')
  const mapping = execSync(file).toString().trim()
  console.log('MAPPING' , mapping)
  const parsed = JSON.parse(mapping)
  const lines = Number(process.stdout.rows)
  return {...parsed, lines}
}

function getDim() {
  const lines = process.stdout.rows
  return { lines: process.stdout.rows }
}
// TODO change this

// mapCursorPosition()
module.exports = {
  sync: () => mapCursorPosition(),
  dim: () => getDim()
}

 // return new Promise ((resolve, reject) => {
//   require('child_process').exec('./cursor-position.sh', function(error, stdout, stderr) {
//     if (error) {
//       reject(error)
//       return
//     }
//     resolve(JSON.parse(stdout));
//   });
// })
