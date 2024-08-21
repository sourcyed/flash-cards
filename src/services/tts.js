let voice;
const getVoice = () => voice ? voice : speechSynthesis.getVoices().find(v => v.lang === 'id-ID')

function speak(word) {
    if (!word)
      return

    speechSynthesis.cancel()

    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(word);
  
    // Select a voice
    utterance.voice = getVoice(); // Choose a specific voice
  
    // Speak the text
    speechSynthesis.speak(utterance);
  }

export default { speak }