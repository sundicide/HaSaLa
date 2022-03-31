class Color {
  hue = 0;
  saturation = 0;
  lightness = 0;
  hex = 0;
  red = 0;
  green = 0;
  blue = 0;
  // const bodyElem = document.querySelector('body')
  // let result = getComputedStyle(bodyElem).getPropertyValue(key)
  // if (key === STYLE_VARIABLE_NAME.SATURATION || key === STYLE_VARIABLE_NAME.LIGHTNESS) {
  //   result = parseInt(result.trim().split('%')[0], 10)
  // }
  // return result
  constructor() {
    this.hue = getValueFromStyleProperty(STYLE_VARIABLE_NAME.HUE)
    this.saturation = getValueFromStyleProperty(STYLE_VARIABLE_NAME.SATURATION)
    this.lightness = getValueFromStyleProperty(STYLE_VARIABLE_NAME.LIGHTNESS)
    this.hex = getValueFromStyleProperty(STYLE_VARIABLE_NAME.HEX)
    this.red = getValueFromStyleProperty(STYLE_VARIABLE_NAME.RED)
    this.green = getValueFromStyleProperty(STYLE_VARIABLE_NAME.GREEN)
    this.blue = getValueFromStyleProperty(STYLE_VARIABLE_NAME.BLUE)
  }
  removeUnit(value) {
    return (value + "").match(/\d{1,3}/)[0]
  }

  getColor(withUnit = false) {
    if (withUnit) {
      return {
        hue: this.hue,
        saturation: this.saturation,
        lightness: this.lightness,
        hex: this.hex,
        red: this.red,
        green: this.green,
        blue: this.blue,
      }
    }
    return {
      hue: this.hue,
      saturation: this.removeUnit(this.saturation),
      lightness: this.removeUnit(this.lightness),
      hex: this.hex,
      red: this.red,
      green: this.green,
      blue: this.blue,
    }
  }
  setColor(key, value = 0) {
    setStyleProperty(key, value)
  }
}

class ColorHSL extends Color {
  constructor() {
    super()
  }

  setColor(hue = null, saturation = null, lightness = null) {
    if (hue !== null) this.hue = hue
    if (saturation !== null) this.saturation = saturation
    if (lightness !== null) this.lightness = lightness

    const [r, g, b] = HSLToRGB(this.hue, this.saturation, this.lightness)
    this.red = r
    this.green = g
    this.blue = b

    const hex = HSLToHex(this.hue, this.saturation, this.lightness)
    this.hex = hex
  }
}

class ColorRGB extends Color {
  constructor() {
    super()
  }

  setColor(red = null, green = null, blue = null) {
    if (red !== null) this.red = parseInt(red.trim(), 10)
    if (green !== null) this.green = parseInt(green.trim(), 10)
    if (blue !== null) this.blue = parseInt(blue.trim(), 10)
    const [h, s, l] = RGBToHSL(this.red, this.green, this.blue)
    this.hue = h
    this.saturation = s
    this.lightness = l

    const hex = RGBToHex(this.red, this.green, this.blue)
    this.hex = hex
  }
}

class ColorHex extends Color {
  constructor() {
    super()
  }

  setColor(hex = null) {
    if (hex !== null) this.hex = hex

    const [h, s, l] = hexToHSL(this.hex)
    this.hue = h
    this.saturation = s
    this.lightness = l

    const [r, g, b] = hexToRGB(this.hex)
    this.red = r
    this.green = g
    this.blue = b
  }
}