export function generateUniqueCode(name: string): string {
    const vowels = 'aeiouAEIOU';
    const consonants = name.replace(/[aeiouAEIOU\s]/g, '');
    const nameLetters = name.replace(/\s/g, '');
    const letters: string[] = [];
  
    // Always pick the first letter of the name
    letters.push(nameLetters[0]);
  
    // Prioritize consonants for the next two letters
    for (let i = 1; i < nameLetters.length && letters.length < 3; i++) {
      if (!vowels.includes(nameLetters[i]) && !letters.includes(nameLetters[i])) {
        letters.push(nameLetters[i]); // Add unique consonants
      }
    }
  
    // If fewer than 3 letters are chosen, fill with vowels or remaining letters
    for (let i = 1; i < nameLetters.length && letters.length < 3; i++) {
      if (!letters.includes(nameLetters[i])) {
        letters.push(nameLetters[i]);
      }
    }
  
    // Ensure the code is exactly three letters
    const threeLetters = letters.slice(0, 3).join('').toUpperCase();
  
    // Handle incrementing numbers for duplicate codes
    if (!generateUniqueCode.codes[threeLetters]) {
      generateUniqueCode.codes[threeLetters] = 1;
    } else {
      generateUniqueCode.codes[threeLetters]++;
    }
    const number = String(generateUniqueCode.codes[threeLetters]).padStart(3, '0');
  
    return `${threeLetters}${number}`;
  }
  
  // Static property to keep track of code counts
  generateUniqueCode.codes = {} as Record<string, number>;
  
  