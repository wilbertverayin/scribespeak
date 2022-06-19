<template>
  <q-page class="container">
    <div class="q-pa-md" :key="currentKey">
      <q-list v-if="hasNotes" bordered separator>
        <q-item
          v-for="note in notes"
          :key="note.uid"
        >
          <q-item-section>
            <q-item-label>
              <q-input :readonly="!note.editMode" type="textarea" v-model="note.text" outlined :filled="note.editMode" />
            </q-item-label>
            <q-item-label caption class="text-center row">
              <div class="col-6">
                <q-btn v-if="!note.editMode" size="sm" class="q-ml-xs" round icon="edit" color="blue" @click="editText(note)" />
                <q-btn v-else round size="sm" class="q-ml-xs" icon="save" color="teal" @click="saveNote(note)" />
                <q-btn round size="sm" class="q-ml-xs" icon="play_arrow" color="green" @click="readText(note.text)" />
                <q-btn round size="sm" class="q-ml-xs" icon="delete" color="red" @click="deleteNote(note)" />
                <q-btn round size="sm" class="q-ml-xs" icon="file_copy" color="purple" v-clipboard="note.text" :key="currentKey+1" @click="showCopied"/>
              </div>
              <div class="col-6">
                <span v-text="formatDate(note)" />&nbsp;
                <span v-text="formatTime(note)" />
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else>No Saved Notes</div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, date } from 'quasar'
import _ from 'lodash'

const appKey = 'SCRIBESPEAK_NOTES'
export default {
  name: 'Notes',
  data () {
    return {
      currentKey: 0,
      notes: []
    }
  },
  mounted () {
    this.loadNotes()
  },
  computed: {
    hasNotes () {
      return !_.isEmpty(this.notes)
    }
  },
  methods: {
    loadNotes () {
      this.notes = LocalStorage.getItem(appKey)
    },
    saveNote (note) {
      const allNotes = LocalStorage.getItem(appKey) || {}
      const noteUid = note.uid
      allNotes[noteUid] = {
        text: note.text,
        saveDate: new Date(),
        uid: noteUid
      }
      this.notes[note.uid].editMode = false
      LocalStorage.set(appKey, allNotes)
      this.refreshComponent()
      this.$notify.success('Note Saved')
    },
    deleteNote (note) {
      const allNotes = LocalStorage.getItem(appKey) || {}
      delete allNotes[note.uid]
      LocalStorage.set(appKey, allNotes)
      this.refreshComponent()
      this.loadNotes()
      this.$notify.success('Note Deleted')
    },
    formatDate (note) {
      return date.formatDate(new Date(note.saveDate), 'MMM DD, YYYY')
    },
    formatTime (note) {
      return date.formatDate(new Date(note.saveDate), 'hh:mm A')
    },
    readText (text) {
      this.$speechTalk(text)
    },
    editText (note) {
      this.notes[note.uid].editMode = true
      this.refreshComponent()
    },
    refreshComponent () {
      this.currentKey++
    },
    showCopied () {
      this.$notify.success('Copied')
    }
  }
}
</script>
