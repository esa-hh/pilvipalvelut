export function getOrCreateCodename(uid) {
  const storageKey = `codename_${uid}`;
  const cachedName = localStorage.getItem(storageKey);
  if (cachedName) return cachedName;

  const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"];
  const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"];
  const number = Math.floor(Math.random() * 3000);
  const newName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${number}`;

  localStorage.setItem(storageKey, newName);
  return newName;
}