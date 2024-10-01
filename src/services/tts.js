let voice

function speak(word) {
    if (!word)
      return

    if (!voice)
      voice = speechSynthesis.getVoices().find(v => v.lang === 'id-ID')

    speechSynthesis.cancel()

    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(word);
  
    // Select a voice
    utterance.voice = voice; // Choose a specific voice
  
    // Speak the text
    speechSynthesis.speak(utterance);
  }

export default { speak }