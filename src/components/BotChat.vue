<script setup>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // Gaya highlight
import { computed, useSlots, ref } from 'vue'
import IconCopy from './icons/IconCopy.vue'
import IconCheck from './icons/IconCheck.vue'

// Ambil isi dari slot sebagai teks
const slots = useSlots()
const rawText = computed(() => slots.default?.()[0]?.children || '')
const isCopy = ref(false)

// Konfigurasi marked + highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  langPrefix: 'hljs language-', // class prefix untuk highlight.js
})

// Convert markdown to HTML
const htmlContent = computed(() => marked(rawText.value))

// copy bot-chat
const copy = () => {
  isCopy.value = true
  navigator.clipboard.writeText(rawText.value)
  setTimeout(() => {
    isCopy.value = false
  }, 1000)
}
</script>

<template>
  <div class="w-full flex justify-start h-fit mb-2 flex-col gap-2">
    <div
      class="mr-2 w-fit dark:bg-gray-900 bg-gray-100 p-5 rounded-r-xl rounded-tl-xl border border-slate-500 overflow-x-hidden whitespace-normal max-w-full"
      v-html="htmlContent"
    ></div>
    <button @click="copy" class="flex justify-start" v-if="!isCopy"><IconCopy /> Copy</button>
    <button @click="copy" class="flex justify-start" v-if="isCopy" disabled>
      <IconCheck /> Copied
    </button>
  </div>
</template>

<style scope>
pre {
  background: rgb(29, 29, 29);
  color: white;
  overflow: auto;
  padding: 8px;
  border-radius: 6px;
  border: gray solid 1px;
}
</style>
