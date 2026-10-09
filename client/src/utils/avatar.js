/**
 * Neutral Character Avatars for SkillSwap Profile Pictures.
 * 5 neutral random character avatars that do not indicate male or female.
 */

export const NEUTRAL_AVATARS = [
  {
    id: 'neutral-1',
    name: 'Nova Bot',
    badge: '🤖 Robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NovaBot&colors=indigo,teal,amber'
  },
  {
    id: 'neutral-2',
    name: 'Echo Spark',
    badge: '⚡ Cyber',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=EchoSpark&colors=cyan,purple'
  },
  {
    id: 'neutral-3',
    name: 'Pixel Hero',
    badge: '👾 Pixel',
    url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CyberPixel'
  },
  {
    id: 'neutral-4',
    name: 'Sparky Emoji',
    badge: '🌟 Emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappySpark'
  },
  {
    id: 'neutral-5',
    name: 'Orbit Gear',
    badge: '🛸 Cosmic',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=OrbitGear&colors=blue,emerald'
  }
];

/**
 * Get default neutral avatar URL based on name or fallback.
 */
export function generateAvatar(name) {
  const seed = encodeURIComponent((name || 'NovaBot').trim());
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&colors=indigo,teal,amber`;
}
