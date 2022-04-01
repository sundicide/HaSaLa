const svgWidth = 300
const svgHeight = 300
const svgHalfWidth = svgWidth / 2
const svgHalfHeight = svgHeight / 2
const arcWidth = 40

const CLASSES = {
  TRIANGLE_G: 'triangle-g',
  TRIANGLE: 'triangle',
  TRIANGLE_CIRCLE: 'triangle-circle',
  WHEEL_CIRCLE: 'wheel-circle',
}
const SELECTOR = {
  SVG_AREA: 'div.svg-area',
  COLOR_TRIANGLE_G: `.${CLASSES.TRIANGLE_G}`,
  COLOR_TRIANGLE: `.${CLASSES.TRIANGLE_G} > .${CLASSES.TRIANGLE}`,
  WHEEL_CIRCLE: `.${CLASSES.WHEEL_CIRCLE}`,
  RESULT_TEXT_HUE: '.svg-area .text',
  RESULT_TEXT_HSL: '.color-result span',
  RESULT_INPUT_SATURATION: '.box.saturation input',
  RESULT_INPUT_LIGHTNESS: '.box.lightness input',
  RESULT_INPUT_R: '.color-result.rgb .wrapper .input.r',
  RESULT_INPUT_G: '.color-result.rgb .wrapper .input.g',
  RESULT_INPUT_B: '.color-result.rgb .wrapper .input.b',
  RESULT_INPUT_HEX: '.color-result.hex input',
}

// add the svg canvas to the DOM
var svg = d3
  .select(SELECTOR.SVG_AREA)
  .append("svg")
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// generate the conic gradient
var gradient = new ConicGradient({
    stops: "red, yellow, lime, aqua, blue, magenta, red"
});

var defs = svg.append('defs')
  .append("pattern")
    .attr("id", "gradient")
    .attr("width", 1)
    .attr("height", 1)
  .append("image")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr('xlink:href', gradient.dataURL);

var g = svg.append("g")
  .attr("transform", "translate("+ svgWidth/2 +","+ svgHeight/2 +")");

var arc = d3.arc()
  .outerRadius(svgWidth / 2)
  .innerRadius((svgHeight / 2) - arcWidth)
  .startAngle(0);

var arcPath = g.append("path")
  .datum({endAngle: Math.PI * 2})
  .attr("d", arc)
  .attr("fill", "url(#gradient)");

var traingleG = svg.append("g")
  .attr("class", CLASSES.TRIANGLE_G)
  .style("transform-origin", 'center')

const r = (svgHalfHeight - arcWidth) / 2
const topPoint = { x: svgHalfWidth, y: arcWidth }
const bottomMidPoint = svgHalfHeight + r
const rightPoint = { x: svgHalfWidth + (r * Math.sqrt(3)), y: bottomMidPoint }
const leftPoint = { x: svgHalfWidth - (r * Math.sqrt(3)), y: bottomMidPoint }

traingleG.append("path")
  .attr("class", CLASSES.TRIANGLE)
  .attr("fill", "hsl(0, 100%, 50%)")
  .attr("d", `M${topPoint.x} ${topPoint.y} L${rightPoint.x} ${rightPoint.y} L${leftPoint.x} ${leftPoint.y} Z`)
  .attr("stroke", "black")
  .attr("stroke-width", "1px")
  .attr("id", "triangle")

const triangleCircleR = 5
traingleG.append('circle')
  .attr("class", CLASSES.TRIANGLE_CIRCLE)
  .attr("fill", "hsl(0, 0%, 100%)")
  .attr("stroke", "black")
  .attr("stroke-width", "1px")
  .attr('cx', topPoint.x)
  .attr('cy', topPoint.y + (triangleCircleR / 2))
  .attr('r', triangleCircleR)

var g2 = svg.append("g")
  .attr("class", "gg")
  .attr("id", "gg")
  .attr("transform", "translate("+ svgHalfWidth +","+ svgHalfHeight +")");
g2.append("circle")
  .attr("class", CLASSES.WHEEL_CIRCLE)
  .attr("cx", 0)
  .attr("cy", -(svgHeight / 2 - 20))
  .attr("r", 10)
  .attr("fill", "black")
  .attr("stroke", "white")
  .attr("stroke-width", "1px")


var circle = document.querySelector(SELECTOR.WHEEL_CIRCLE)
var g2 = document.querySelector("#gg")

gsap.to([circle], {
  svgOrigin: '0 0'
})

function dragUpdate() {
  var rotation = gsap.getProperty(SELECTOR.WHEEL_CIRCLE, "rotation")

  d3.select(SELECTOR.COLOR_TRIANGLE_G)
    .style("transform", `rotate(${rotation}deg)`)

  d3.select(SELECTOR.COLOR_TRIANGLE)
    .attr("fill", `hsl(${rotation}, 100%, 50%)`)

  setStyleProperty(STYLE_VARIABLE_NAME.HUE, rotation)

  let color =  `hsl(${rotation}, 80%, 20%)`
  if (rotation > 200)  color = `hsl(${rotation}, 20%, 80%)`

  d3.select(SELECTOR.RESULT_TEXT_HUE)
    .text(`${rotation} deg`)
    .style('color', color)

  const colorHSL = new ColorHSL()
  colorHSL.setColor(rotation)

  updateColor(colorHSL)
}

Draggable.create(circle, {
  type: 'rotation',
  bounds:{ maxRotation:360, minRotation:0 },
  liveSnap: {
    rotation: value => Math.round(value)
  },
  throwProps: true,
  onDrag:dragUpdate,
  inertia: true,
})

function onChangeHex(newValue) {
  var splitted = newValue.match(/.{2}/g)

  function isHex(num) {
    return Boolean(num.match(/^[0-9a-f]+$/i))
  }
  if (splitted.length === 3 && splitted.every(str => isHex(str))) {
    const colors = new ColorHex()
    colors.setColor(newValue)

    updateColor(colors)
  }
}

function onChangeSaturation(newValue) {
  const colors = new ColorHSL()
  colors.setColor(null, newValue, null)

  updateColor(colors)
}

function onChangeLightness(newValue) {
  const colors = new ColorHSL()
  colors.setColor(null, null, newValue)

  updateColor(colors)
}

function onChangeRgb(r = null, g = null, b = null) {
  const colorRgb = new ColorRGB()
  colorRgb.setColor(r, g, b)

  updateColor(colorRgb)
}


function updateHslColorText() {
  const hue = getValueFromStyleProperty(STYLE_VARIABLE_NAME.HUE)
  const saturation = getValueFromStyleProperty(STYLE_VARIABLE_NAME.SATURATION)
  const lightness = getValueFromStyleProperty(STYLE_VARIABLE_NAME.LIGHTNESS)

  d3.select(SELECTOR.RESULT_TEXT_HSL)
    .text(`hsl(${hue} deg, ${saturation}%, ${lightness}%)`)
}

function updateTriangleColor() {
  const hue = getValueFromStyleProperty(STYLE_VARIABLE_NAME.HUE)
  const saturation = getValueFromStyleProperty(STYLE_VARIABLE_NAME.SATURATION)
  const lightness = getValueFromStyleProperty(STYLE_VARIABLE_NAME.LIGHTNESS)

  d3.select(SELECTOR.COLOR_TRIANGLE)
    .attr("fill", `hsl(${hue}deg, ${saturation}%, ${lightness}%)`)
}

function updateHSL(hue, saturation, lightness) {
  d3.select(SELECTOR.COLOR_TRIANGLE_G)
    .style("transform", `rotate(${hue}deg)`)

  d3.select(SELECTOR.COLOR_TRIANGLE)
    .attr("fill", `hsl(${hue}, 100%, 50%)`)
  d3.select(SELECTOR.WHEEL_CIRCLE)
    .attr("transform", `rotate(${hue})`)
  gsap.set(SELECTOR.WHEEL_CIRCLE, {
    rotation: hue
  })


  let color =  `hsl(${hue}, 80%, 20%)`
  if (hue > 200)  color = `hsl(${hue}, 20%, 80%)`

  d3.select(SELECTOR.RESULT_TEXT_HUE)
    .text(`${hue} deg`)
    .style('color', color)

  setStyleProperty(STYLE_VARIABLE_NAME.HUE, hue)
  setStyleProperty(STYLE_VARIABLE_NAME.SATURATION, `${saturation}%`)
  setStyleProperty(STYLE_VARIABLE_NAME.LIGHTNESS, `${lightness}%`)

  document.querySelector(SELECTOR.RESULT_INPUT_SATURATION).value = saturation
  document.querySelector(SELECTOR.RESULT_INPUT_LIGHTNESS).value = lightness

  d3.select(SELECTOR.RESULT_TEXT_HSL)
    .text(`hsl(${hue} deg, ${saturation}, ${lightness})`)
}

/**
 *
 * @param {*} hex FFFFFF. 앞에 # 을 뺀 6자리 문자
 */
function updateHex(hex) {
  document.querySelector(SELECTOR.RESULT_INPUT_HEX).value = `${hex}`

  setStyleProperty(STYLE_VARIABLE_NAME.HEX, `#${hex}`)
}

function updateRGB(r, g, b) {
  document.querySelector(SELECTOR.RESULT_INPUT_R).value = r
  document.querySelector(SELECTOR.RESULT_INPUT_G).value = g
  document.querySelector(SELECTOR.RESULT_INPUT_B).value = b

  setStyleProperty(STYLE_VARIABLE_NAME.RED, r)
  setStyleProperty(STYLE_VARIABLE_NAME.GREEN, g)
  setStyleProperty(STYLE_VARIABLE_NAME.BLUE, b)
}

function updateColor(colors) {
  const { red, green, blue, hue, saturation, lightness, hex } = colors.getColor()

  updateRGB(red, green, blue)
  updateHSL(hue ,saturation, lightness)
  updateHex(hex)

  updateHslColorText()
}
