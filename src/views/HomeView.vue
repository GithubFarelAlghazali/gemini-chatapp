<script setup>
import UserChat from '../components/UserChat.vue'
import BotChat from '../components/BotChat.vue'
import { requestGroqChat } from '@/services/groq'
import { requestGemini } from '@/services/gemini'
import { ref, nextTick } from 'vue'

const input = ref('')
// const messages = ref([])
// const messages = ref('')
const userChats = ref([])
const botChats = ref([])
const chatContainer = ref(null)

const handleAsk = async () => {
  // show bubble chat
  if (input.value.trim() === '') return

  const userChat = input.value.trim()
  // messages.value.push({
  //   role: 'user',
  //   content: userChat,
  // })
  userChats.value.push(input.value) // Simpan ke daftar chat
  input.value = '' // Reset input

  // request groq chat
  // try {
  //   const botReply = await requestGroqChat(messages.value)
  //   botChats.value.push(botReply)
  //   messages.value.push({ role: 'assistant', content: botReply })
  // } catch (error) {
  //   const errMsg = 'Error while processing request, please check your connection'
  //   botChats.value.push(errMsg)
  //   console.error('Groq request error:', error)
  // }

  // request to gemini
  try {
    const botReply = await requestGemini(userChat)
    botChats.value.push(botReply)
  } catch (error) {
    const errMsg = 'Error while processing request, please check your connection'
    botChats.value.push(errMsg)
    console.error('Gemini request error:', error)
  }

  // scroll to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}
</script>

<template>
  <header
    class="bg-white border border-slate-400 m-4 p-4 rounded-lg text-center font-bold w-[90vw] md:w-[70vw] mx-auto"
  >
    <h2>Vue + Gemini</h2>
  </header>
  <main
    ref="chatContainer"
    class="bg-gray-200 rounded-lg m-4 p-4 h-[80vh] relative overflow-y-auto w-[90vw] md:w-[70vw] mx-auto"
  >
    <h1
      v-if="userChats.length < 1"
      class="absolute top-[50%] w-full text-center text-2xl font-bold"
    >
      ^^<br />
      Can i help you today?
    </h1>
    <div class="md:pb-20">
      <div v-for="(msg, index) in userChats" :key="index">
        <UserChat>{{ msg }}</UserChat>
        <BotChat v-if="botChats[index]">{{ botChats[index] }}</BotChat>
      </div>
    </div>
    <div
      class="fixed left-4 right-4 bottom-10 rounded-md overflow-hidden border bg-white border-slate-500 md:left-[25vw] md:right-[25vw]"
    >
      <input type="text" class="w-[85%] focus:outline-none p-2" v-model="input" />
      <button
        class="w-[15%] md:w-[12%] rounded-sm bg-green-500 p-2 hover:bg-green-600 border border-slate-500 md:m-2"
        @click="handleAsk"
      >
        Ask
      </button>
    </div>
  </main>
</template>
