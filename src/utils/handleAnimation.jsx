const handleAnimation = (selector, animationClass, duration = 800) => {
  const element = document.querySelector(selector);

  if (element) {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  }
};

export { handleAnimation };
