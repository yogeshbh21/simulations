window.onload = function () {};

document.addEventListener("DOMContentLoaded", function () {
  // Your code here, to be executed after the DOM is ready
  const storyToRun = getStoryByType(STORY_TYPES.STORY_2);
  callFunctionByName(storyToRun);
});

const callFunctionByName = (name) => {
  if (window[name] && typeof window[name] === "function") {
    window[name]();
  } else {
    console.error(`Function '${name}' not found or is not a function`);
  }
};
