const STYLE_VARIABLE_NAME = {
  HUE: '--main-color-hue',
  SATURATION: '--main-color-saturation',
  LIGHTNESS: '--main-color-lightness',
  RED: '--main-color-red',
  GREEN: '--main-color-green',
  BLUE: '--main-color-blue',
  HEX: '--main-color-hex',
}

function getValueFromStyleProperty(key) {
  const bodyElem = document.querySelector('body')
  let result = getComputedStyle(bodyElem).getPropertyValue(key)
  if (key === STYLE_VARIABLE_NAME.SATURATION || key === STYLE_VARIABLE_NAME.LIGHTNESS) {
    result = parseInt(result.trim().split('%')[0], 10)
  } else if (key === STYLE_VARIABLE_NAME.HEX) {
    result = result.trim().slice(1, result.length)
  } else if (
    key === STYLE_VARIABLE_NAME.BLUE ||
    key === STYLE_VARIABLE_NAME.RED ||
    key === STYLE_VARIABLE_NAME.GREEN ||
    key === STYLE_VARIABLE_NAME.HUE
  ) {
    result = parseInt(result.trim(), 10)
  }
  return result
}

function setStyleProperty(key, value) {
  document.querySelector("body").style.setProperty(key,value)
}