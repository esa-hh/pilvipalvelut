import { saveSession, getSession } from "./gameSessionService";

export async function resetGame() {
  const session = await getSession();
  if (!session) return;

  const resetSession = {
    ...session,
    status: "waiting",
    currentRound: 1,
    currentProduct: null,
    correctPrice: null,
    winnerCodename: null,
    players: session.players.map((player) => ({
      ...player,
      score: 0,
      guess: null,
    })),
  };
  await saveSession(resetSession);
}

export async function clearPlayers() {
  const session = await getSession();
  if (!session) return;
  await saveSession({
    ...session,
    players: [],
  });
}

export async function startGameIfPossible(session) {
  if (session.status !== "waiting") return;
  if (session.players.length < 2) {
    throw new Error("Peli vaatii vähintään 2 pelaajaa.");
  }
  const product = await fetchRandomProduct();
  await saveSession({
    ...session,
    status: "playing",
    currentProduct: product,
    correctPrice: null,
    players: session.players.map((player) => ({
      ...player,
      guess: null,
    })),
  });
}

export async function submitGuess(uid, guess) {
  const session = await getSession();
  if (!session) return;
  if (session.status !== "playing") return;
  if (!session.currentProduct) return;

  const updatedPlayers = session.players.map((player) =>
    player.uid === uid ? { ...player, guess } : player
  );

  const allGuessed =
    updatedPlayers.length >= 2 &&
    updatedPlayers.every((player) => player.guess !== null);

  let updatedSession = {
    ...session,
    players: updatedPlayers,
  };

  if (allGuessed) {
    const correctPrice = session.currentProduct.price;
    const playersWithScores = updatedPlayers.map((player) => {
      const difference = Math.abs((player.guess ?? 0) - correctPrice);
      const points = Math.max(0, 100 - difference);
      return {
        ...player,
        score: player.score + points,
      };
    });

    updatedSession = {
      ...updatedSession,
      players: playersWithScores,
      correctPrice,
    };
  }

  await saveSession(updatedSession);
}

export async function nextRound() {
  const session = await getSession();
  if (!session) return;

  if (session.currentRound >= session.maxRounds) {
    const winner = [...session.players].sort((a, b) => b.score - a.score)[0];
    await saveSession({
      ...session,
      status: "finished",
      winnerCodename: winner?.codename ?? null,
    });
    return;
  }

  const product = await fetchRandomProduct();
  await saveSession({
    ...session,
    currentRound: session.currentRound + 1,
    currentProduct: product,
    correctPrice: null,
    players: session.players.map((player) => ({
      ...player,
      guess: null,
    })),
  });
}

async function fetchRandomProduct() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  const products = data.products;
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}