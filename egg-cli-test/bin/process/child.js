console.log('child process');
console.log('main pid', process.pid);

process.on('message', (msg) => {
    console.log(msg);
})
process.send('hello main process!')