const inquirer = require('inquirer')

inquirer
  .prompt([
    {
      type: 'input',
      name: 'kickAss',
      message: 'can i kick you ass?',
      default: 'yes',
      validate: (v) => {
        return v ? true : false
      },
      transformer: (v) => {
          return `choose: ${v}`
      },
      filter: (v) => {
          return `answers: ${v}`
      }
    },
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log(answers);
    if (answers.kickAss === 'fuck you') {
      throw new Error('bad choose')
    } else {
      throw new Error('给老子乖乖站好')
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log('1', error.message)
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log('2', error.message)
      // Something else went wrong
    }
  })
