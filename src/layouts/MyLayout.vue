<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          ScribeSpeak
        </q-toolbar-title>

        <div>ScribeSpeak v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"

      elevated
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item
          clickable
          exact
          to="/"
        >
          <q-item-section avatar>
            <q-icon name="speaker_notes"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Speech to text</q-item-label>
            <q-item-label caption>Convert speech to text and vice versa</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/notes">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notes</q-item-label>
            <q-item-label caption>Saved texts</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  // :overlay="$q.platform.is.cordova"

  data () {
    return {
      version: '0.0.5',
      leftDrawerOpen: false
    }
  }
}
</script>
