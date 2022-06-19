<template>
  <q-page class="container" :key="componentIndex">
    <div class="row justify-center" style="height: 60vh">
      <q-input
        class="col-10 q-mt-sm"
        outlined
        rows="15"
        min-columns="6"
        v-model="text"
        label="Text"
        type="textarea"
        filled
      />
    </div>
    <div v-show="isRecording" class="row justify-center q-mt-md">
      <div class="col-12 text-center">
        <q-spinner-bars
          color="primary"
          size="2em"
        />
      </div>

      <div class="col-12 text-center">
        Recording...
      </div>

    </div>
    <q-footer class="bg-white text-primary">
      <div class="row">
        <div class="col-3">
          <q-btn
            icon="play_arrow"
            class="full-width"
            color="green"
            @click="readText()"
          />
        </div>
        <div class="col-3">
          <q-btn
            icon="save"
            class="full-width"
            color="teal"
            @click="saveNote()"
          />
        </div>
        <div class="col-3">
          <q-btn
            icon="stop"
            class="full-width"
            color="red"
            @click="stopRecording()"
          />
        </div>
        <div class="col-3">
          <q-btn
            icon="mic"
            :disabled="isRecording"
            class="full-width"
            color="primary"
            @click="recordSpeech()"
          />
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { LocalStorage, uid } from 'quasar'
const appKey = 'SCRIBESPEAK_NOTES'

export default {
  name: 'Index',
  data () {
    return {
      componentIndex: 0,
      isRecording: false,
      counter: null,
      text: ''
    }
  },
  methods: {
    saveNote () {
      if (!this.text) {
        return
      }

      const allNotes = LocalStorage.getItem(appKey) || {}
      const noteUid = uid()
      allNotes[noteUid] = {
        text: this.text,
        saveDate: new Date(),
        uid: noteUid
      }
      this.text = ''
      LocalStorage.set(appKey, allNotes)
      this.$notify.success('Note Saved')
    },
    refreshComponent () {
      this.componentIndex++
    },
    setText (text) {
      this.text = text
    },
    append (transcript) {
      if (transcript) {
        this.setText(this.text + ' ' + transcript)
      }
    },
    setIsRecording (value) {
      this.isRecording = value
    },
    readText () {
      this.$speechTalk(this.text)
    },
    async recordSpeech () {
      this.setIsRecording(true)
      try {
        await this.$speechToText.start(this.append)
        this.refreshComponent()
      } catch (error) {
        this.$notify.error(error)
      }
    },
    stopRecording () {
      // this.$notify.success('Recorded, converting to text')
      this.$speechToText.stop()
      this.setIsRecording(false)
      this.refreshComponent()
    }
  }
}
</script>
