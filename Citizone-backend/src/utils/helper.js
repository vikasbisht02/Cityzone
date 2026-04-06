export const  capitalizeName = (name) => {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const getMinutesFromNow = (min) => new Date(Date.now() + min * 60 * 1000);

