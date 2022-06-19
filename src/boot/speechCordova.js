import { Loading, QSpinnerAudio, Platform } from 'quasar'
export default async ({ Vue }) => {
  const lang = 'en-US'
  Vue.prototype.$speechTalk = (text) => {
    return new Promise((resolve, reject) => {
      if (Platform.is.cordova) {
        cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
          if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
            Loading.show({
              delay: 0,
              spinner: QSpinnerAudio, // ms,
              backgroundColor: 'primary'
            })
            window.TTS.speak({
              text: text,
              locale: lang,
              rate: 0.60
            }, () => {
              Loading.hide()
              setTimeout(() => {
                resolve(true)
              }, 400)
            }, (reason) => {
              reject(reason)
            })
          }
        }, function (error) {
          reject(error)
          console.error(error)
        })
      } else {
        let speech = new SpeechSynthesisUtterance()
        // Set the text and voice attributes.
        speech.lang = lang
        speech.text = text
        speech.volume = 1
        speech.rate = 1
        speech.pitch = 1
        setTimeout(() => {
          window.speechSynthesis.speak(speech)
        }, 300)

        speech.addEventListener('end', () => {
          Loading.hide()
          resolve(true)
        })
      }
    })
  }

  Vue.prototype.$speechToText = {
    start: (callback) => {
      return new Promise((resolve, reject) => {
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        let recognition = SpeechRecognition ? new SpeechRecognition() : false
        let text = ''

        if (Platform.is.cordova) {
          cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
            if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
              Loading.show({
                delay: 0,
                spinner: QSpinnerAudio, // ms,
                backgroundColor: 'primary'
              })
              window.TTS.speak({
                text: text,
                locale: lang,
                rate: 0.60
              }, () => {
                Loading.hide()
                setTimeout(() => {
                  resolve(true)
                }, 400)
              }, (reason) => {
                reject(reason)
              })
            }
          }, function (error) {
            reject(error)
            console.error(error)
          })
        }

        setTimeout(() => {
          recognition.lang = lang
          recognition.continuous = true
          recognition.start()
        }, 400)

        recognition.onresult = (event) => {
          let current = event.resultIndex
          let transcript = event.results[current][0].transcript
          text += transcript
          console.log('onresult', transcript)

          callback(transcript)
          resolve(text)
          // Notify.create({
          //   color: 'positive',
          //   message: 'Text: ' + text,
          //   closeBtn: '✖'
          // })
        }
        recognition.onspeechend = () => {
          console.log('onspeechend', text)
        }
        recognition.onend = () => {
          console.log('onend', text)
        }
      })
    },
    stop: () => {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      let recognition = SpeechRecognition ? new SpeechRecognition() : false

      recognition.stop()
    }
  }

  Vue.prototype.$clipboardCopy = (text) => {
    const clipboard = cordova ? cordova.plugins.clipboard : {}
    return () => {
      clipboard.copy && clipboard(text)
    }
  }
}
