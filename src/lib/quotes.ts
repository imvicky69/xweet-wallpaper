/**
 * Curated Gen-Z style quotes displayed when users reach the final page of wallpapers.
 * Captures a witty, aesthetic, and playful tone that celebrates finishing the catalog.
 */
export const GEN_Z_END_QUOTES: string[] = [
  "this is the end fr fr. you reached the absolute bottom of the rabbit hole 🕳️",
  "good things take time bestie. we're cooking up fresh drops in the studio 🧑‍🍳",
  "there is never enough wallpapers... but you somehow scrolled through all of them ✨",
  "that's it, that's the whole drop. time to close the tabs and touch some grass 🌱",
  "no more pixels left to render. you ate the whole catalog up, no crumbs 💅",
  "you really viewed every single wallpaper? immaculate patience, 10/10 no notes 🏆",
  "end of the road bestie. our servers are taking a well-deserved iced matcha break 🍵",
  "caught you in 4k at the very last page! more heat is on the way 🔥",
  "all outta drops for now. go flex your new wallpaper on the lockscreen 📱",
  "bro reached the finish line 🏁 stay tuned, fresh heat on the way.",
  "you officially scrolled the entire archive. lowkey impressive ngl 🫡",
  "nothing left here except pristine vibes. check back soon for fresh drops ⚡",
  "congrats, you beat the catalog. take a screenshot, you won today 📸",
  "it's giving perfectionist. we respect the dedication, but that's all for today 🫶",
  "gg no re. new master wallpapers are currently baking in the oven 🥖",
  "you hit the final boss of wallpaper browsing. catalog 100% completed 👾",
];

export function getRandomQuoteIndex(excludeIndex?: number): number {
  if (GEN_Z_END_QUOTES.length <= 1) return 0;
  let next = Math.floor(Math.random() * GEN_Z_END_QUOTES.length);
  if (excludeIndex !== undefined && next === excludeIndex) {
    next = (next + 1) % GEN_Z_END_QUOTES.length;
  }
  return next;
}
