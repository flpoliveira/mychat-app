const timers = {
  //
} as Record<string, NodeJS.Timeout>;

function debounce(identifier: string, callback: any, millis: number) {
  if (timers[identifier]) {
    clearTimeout(timers[identifier]);
  }
  timers[identifier] = setTimeout(callback, millis);
}

export default debounce;
