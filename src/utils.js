
function throttle(func, delayMs) {
	let lastArgs;
  let throttling = false;

  return function() {
    lastArgs = arguments;

    if (!throttling) {
      throttling = true;

      setTimeout(() => {
        throttling = false;
        func.call(this, ...lastArgs);
      }, delayMs);
    }
  };
}


function debounce(func, debounceMs) {
  let lastArgs;
  let timer;

  return function() {
    lastArgs = arguments;

    clearTimeout(timer);

    timer = setTimeout(() => {
      func.call(this, ...lastArgs);
    }, debounceMs);
  }
}


export { throttle, debounce }