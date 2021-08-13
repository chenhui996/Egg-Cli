const cp = require('child_process')
const path = require('path')

// cp.exec(
//   path.resolve(__dirname, 'test.shell'),
//   {
//     cwd: path.resolve('..')
//   },
//   (err, stdout, stderr) => {
//     console.log(err)
//     console.log(stdout)
//     console.log(stderr)
//   },
// )

// cp.execFile(
//   path.resolve(__dirname, 'test.shell'),
//   ['-al', '-bl'],
//   (err, stdout, stderr) => {
//     console.log(err)
//     console.log(stdout)
//     console.log(stderr)
//   },
// )

// --------------------------------------------------------------------

// const child = cp.spawn(path.resolve(__dirname, 'test.shell'), ['-al', '-bl'], {
//     cwd: path.resolve('..')
// })

// child.stdout.on('data', (chunk) => {
//     console.log('stdout',chunk.toString());
// })

// child.stderr.on('data', (chunk) => {
//     console.log('stderr',chunk.toString());
// })

// --------------------------------------------------------------------

const child = cp.fork(path.resolve(__dirname, 'child.js'))
child.send('hello child process!', () => {
    // child.disconnect()
})
child.on('message', (msg) => {
    console.log(msg);
})
console.log('main pid', process.pid);
