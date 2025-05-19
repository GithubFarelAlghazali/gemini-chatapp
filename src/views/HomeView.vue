<script setup>
import UserChat from '../components/UserChat.vue'
import BotChat from '../components/BotChat.vue'
import ThemeTogle from '../components/ThemeTogle.vue'
import { requestGemini } from '@/services/gemini'
import { greetingTime } from '@/services/greeting'
import { ref, nextTick, onMounted } from 'vue'
import IconLoad from '../components/icons/IconLoad.vue'

const input = ref('')
const isLoading = ref(false)
const greeting = ref('')
onMounted(() => {
  greeting.value = greetingTime()
})

const userChats = ref([])
const botChats = ref([])
const chatContainer = ref(null)

const handleAsk = async () => {
  // show bubble chat
  if (input.value.trim() === '') return

  const userChat = input.value.trim()

  userChats.value.push(input.value)
  input.value = ''
  await scrollToBottom()
  isLoading.value = true

  // request to gemini
  try {
    const botReply = await requestGemini(userChat)
    botChats.value.push(botReply)
  } catch (error) {
    const errMsg = 'Error while processing request'
    botChats.value.push(errMsg)
    console.error('Gemini request error:', error)
  }
  isLoading.value = false
}

// scroll to bottom
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <header
    class="bg-white dark:bg-gray-900 border relative border-slate-400 m-4 p-4 rounded-lg text-center font-bold w-[90vw] md:w-[70vw] mx-auto"
  >
    <ThemeTogle />
    <h2>Vue + Gemini</h2>
  </header>
  <main
    ref="chatContainer"
    class="bg-gray-200 dark:bg-gray-800 rounded-lg m-4 p-4 h-[80vh] relative overflow-x-hidden overflow-y-auto w-[90vw] md:w-[70vw] mx-auto"
  >
    <h1
      v-if="userChats.length < 1"
      class="absolute top-0 bottom-0 right-0 left-0 pt-32 text-center text-xl md:text-4xl font-semibold"
    >
      ^^<br />
      {{ greeting }}
    </h1>
    <div class="pb-24 md:pb-26 w-full">
      <div v-for="(msg, index) in userChats" :key="index">
        <UserChat>{{ msg }}</UserChat>
        <BotChat v-if="botChats[index]" @doneTyping="scrollToBottom">{{ botChats[index] }}</BotChat>
      </div>
    </div>
    <div
      class="fixed left-4 right-4 bottom-10 rounded-md overflow-hidden border dark:bg-gray-900 bg-white border-slate-500 md:left-[25vw] md:right-[25vw] flex justify-evenly"
    >
      <textarea
        type="text"
        class="w-[80%] focus:outline-none resize-none p-3 dark:bg-gray-900"
        v-model="input"
      ></textarea>
      <button
        v-if="!isLoading"
        class="w-[15%] md:w-[17%] rounded-md bg-green-500 p-2 hover:bg-green-600 border dark:bg-green-800 border-slate-500 m-2"
        @click="handleAsk"
      >
        Ask
      </button>
      <button
        v-if="isLoading"
        class="w-[15%] md:w-[17%] rounded-md bg-green-500 p-2 hover:bg-green-600 border dark:bg-green-800 border-slate-500 m-2"
        disabled
      >
        <IconLoad class="animate-spin mx-auto cursor-not-allowed" />
      </button>
    </div>
  </main>
</template>
