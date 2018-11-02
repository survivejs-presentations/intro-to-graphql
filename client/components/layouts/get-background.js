function getBackground(background) {
  if (!background || !background.asset) {
    return;
  }

  return background && `${linearGradient()},url(${background.asset})`;
}

// TODO: Make this more flexible
function linearGradient() {
  return `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`;
}

export default getBackground;
