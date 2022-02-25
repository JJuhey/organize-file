const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')

console.log('안녕하세요. PC청소 도우미입니다.')
console.log('다음 질문에 대답해주시면 청소를 시작하겠습니다.')

const questions = [
  {
    type: 'confirm',
    name: 'removeAll',
    message: '완전 삭제를 원하시나요?',
    default: false,
  },
  {
    type: 'input',
    name: 'filePath',
    message: '정리를 원하시는 폴더경로를 입력: ',
    validate(value) {
      if (value === '') return `현재경로: ${__dirname} 기준으로 입력해주세요.`
      const tempPath = path.join(__dirname, value)
      const isExisted = fs.existsSync(tempPath)
      if (isExisted) return true
      return `파일경로를 확인할 수 없습니다. 다시 입력해주세요. (현재경로: ${__dirname})`
    }
  },
]


inquirer
  .prompt(questions)
  .then((answers) => {
    const { removeAll, filePath } = answers

    const inputPath = path.join(__dirname, filePath)

    const today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    const ssPath = path.join(inputPath, `screenshots_${today}`)
    const photoPath = path.join(inputPath, `camera_${today}`)
    const etcPath = path.join(inputPath, `etc_photos_${today}`)

    const videoPath = path.join(inputPath, `video_${today}`)

    fs.readdir(inputPath, (err, files) => {
      console.log('이제 파일정리를 시작합니다.')
      if (err) {
        console.error('파일을 읽는데 실패하였습니다. 파일 이름을 확인해주세요.')
        throw err
      }

      if (!fs.existsSync(ssPath)) fs.mkdirSync(ssPath)
      if (!fs.existsSync(photoPath)) fs.mkdirSync(photoPath)
      if (!fs.existsSync(etcPath)) fs.mkdirSync(etcPath)
      if (!fs.existsSync(videoPath)) fs.mkdirSync(videoPath)

      for(const file of files) {
        const splitedFile = file.split('.')
        const ext = splitedFile[splitedFile.length - 1]
        const oldPath = path.join(inputPath, file)
        
        // screenshot
        if (file.match(/스크린샷+/g) && ext.match(/png|jpeg|jpg/gi)) {
          fs.renameSync(oldPath, path.join(ssPath, file))
          continue;
        }

        // camera
        if (file.match(/^IMG/g) && ext.match(/png|jpeg|jpg|HEIC/gi)) {
          fs.renameSync(oldPath, path.join(photoPath, file))
          continue;
        }

        if (ext.match(/png|jpeg|jpg|HEIC/gi)) {
          fs.renameSync(oldPath, path.join(etcPath, file))
        }

        if (ext.match(/MOV|MP4/gi)) {
          fs.renameSync(oldPath, path.join(videoPath, file))
        }
      }
      console.log('청소가 완료되었습니다. 언제든지 필요하면 다시오세요~:)')
    })
  })
