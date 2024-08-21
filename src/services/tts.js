function speak(word) {
    if (!word)
      return

    speechSynthesis.cancel()

    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(word);
  
    // Select a voice
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[12]; // Choose a specific voice
  
    // Speak the text
    speechSynthesis.speak(utterance);
  }

export default { speak }