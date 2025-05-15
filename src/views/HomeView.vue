<script setup>
import UserChat from '../components/UserChat.vue'
import BotChat from '../components/BotChat.vue'
import { requestGroqChat } from '@/services/groq'
import { ref } from 'vue'

const input = ref('')
const messages = ref([])
const userChats = ref([])
const botChats = ref([])

const handleAsk = async () => {
  // show bubble chat
  if (input.value.trim() === '') return

  const userChat = input.value.trim()
  messages.value.push({
    role: 'user',
    content: userChat,
  })
  userChats.value.push(input.value) // Simpan ke daftar chat
  input.value = '' // Reset input

  // request groq chat
  try {
    const botReply = await requestGroqChat(messages.value)
    botChats.value.push(botReply)
    messages.value.push({ role: 'assistant', content: botReply })
  } catch (error) {
    const errMsg = 'Error while processing request, please check your connection'
    botChats.value.push(errMsg)
    console.error('Groq request error:', error)
  }
}
</script>

<template>
  <header
    class="bg-white border border-slate-400 m-4 p-4 rounded-lg text-center font-bold md:w-[50vw] mx-auto"
  >
    <h2>Vue + Groq</h2>
  </header>
  <main
    class="bg-gray-200 rounded-lg m-4 p-4 h-[80vh] relative overflow-y-auto md:w-[50vw] mx-auto"
  >
    <h1
      v-if="userChats.length < 1"
      class="absolute top-[50%] w-full text-center text-2xl font-bold"
    >
      ^^<br />
      Chat with Groq
    </h1>
    <div v-for="(msg, index) in userChats" :key="index">
      <UserChat>{{ msg }}</UserChat>
      <BotChat v-if="botChats[index]">{{ botChats[index] }}</BotChat>
    </div>
    <div
      class="fixed left-4 right-4 bottom-10 rounded-md overflow-hidden border border-slate-500 md:left-[25vw] md:right-[25vw]"
    >
      <input type="text" class="w-[85%] focus:outline-none p-2" v-model="input" />
      <button class="w-[15%] bg-green-500 p-2 hover:bg-green-600" @click="handleAsk">Ask</button>
    </div>
  </main>
</template>
