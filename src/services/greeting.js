export const greetingTime = () => {
  const now = new Date()
  const hour = now.getHours()

  if (hour > 5 && hour < 12) {
    return 'Good Morning, can i help you today?'
  } else if (hour > 12 && hour < 16) {
    return 'Hi, need a help?'
  } else if (hour > 16 && hour < 24) {
    return "Don't forget drink water🥤, okay?"
  } else {
    return "This is rest time, isn't?"
  }
}
