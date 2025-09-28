export const WORD_CATEGORIES = {
  nature: [
    'Volcano', 'Ocean', 'Forest', 'Mountain', 'Desert', 'Rainbow', 'Thunderstorm', 
    'Aurora', 'Glacier', 'Canyon', 'Waterfall', 'Sunset', 'Tornado', 'Earthquake'
  ],
  food: [
    'Pizza', 'Sushi', 'Chocolate', 'Ice Cream', 'Burger', 'Pasta', 'Taco', 
    'Sandwich', 'Salad', 'Soup', 'Cake', 'Cookie', 'Coffee', 'Tea'
  ],
  technology: [
    'Smartphone', 'Computer', 'Internet', 'Instagram', 'YouTube', 'TikTok', 
    'Netflix', 'Spotify', 'Google', 'Facebook', 'Twitter', 'Discord', 'Zoom'
  ],
  animals: [
    'Elephant', 'Dolphin', 'Eagle', 'Lion', 'Penguin', 'Butterfly', 'Shark', 
    'Tiger', 'Giraffe', 'Panda', 'Owl', 'Whale', 'Kangaroo', 'Peacock'
  ],
  objects: [
    'Car', 'Airplane', 'Bicycle', 'Camera', 'Guitar', 'Book', 'Clock', 
    'Umbrella', 'Ladder', 'Mirror', 'Candle', 'Backpack', 'Sunglasses', 'Watch'
  ],
  activities: [
    'Swimming', 'Dancing', 'Singing', 'Cooking', 'Reading', 'Painting', 
    'Hiking', 'Shopping', 'Gaming', 'Traveling', 'Photography', 'Yoga', 'Meditation'
  ],
  places: [
    'Beach', 'Library', 'Museum', 'Park', 'Restaurant', 'Hospital', 'School', 
    'Airport', 'Hotel', 'Gym', 'Cinema', 'Mall', 'Church', 'Stadium'
  ]
};

export const ALL_WORDS = Object.values(WORD_CATEGORIES).flat();

export function getRandomWord(category?: keyof typeof WORD_CATEGORIES): string {
  if (category && WORD_CATEGORIES[category]) {
    const words = WORD_CATEGORIES[category];
    return words[Math.floor(Math.random() * words.length)];
  }
  return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
}

export function getRandomWords(count: number, category?: keyof typeof WORD_CATEGORIES): string[] {
  const words = category ? WORD_CATEGORIES[category] : ALL_WORDS;
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
