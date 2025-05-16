document.addEventListener('DOMContentLoaded', () => {
    // Text to type
    const text = "Draw your Signature here...";
    
    // Get the element where the text will be typed
    const typedTextElement = document.getElementById('typed-text');
    
    // Typing speed (milliseconds)
    const typingSpeed = 100;
    
    // Delay before starting to type
    const startDelay = 500;
    
    // Function to type the text
    const typeText = () => {
        let charIndex = 0;
        
        // Clear any existing text
        typedTextElement.textContent = '';
        
        // Start typing after delay
        setTimeout(() => {
            // Set up interval to add one character at a time
            const typingInterval = setInterval(() => {
                // Add the next character
                if (charIndex < text.length) {
                    typedTextElement.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    // Stop the interval when done typing
                    clearInterval(typingInterval);
                }
            }, typingSpeed);
        }, startDelay);
    };
    
    // Start the typing effect
    typeText();
    
    // Replay typing effect when clicked (optional)
    document.getElementById('typing-heading').addEventListener('click', typeText);
});