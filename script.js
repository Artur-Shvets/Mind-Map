"use strict";

// All Variables__________________________
let
  canvas = document.getElementById("Canvas"),
  ctx = canvas.getContext('2d'),
  widthCanvas = canvas.width = window.innerWidth,
  heightCanvas = canvas.height = window.innerHeight,
  isMouseDown = false,
  activeBlocks = false,
  activeFeatures = false,
  activeInput = false,
  activeInputColor = false,
  hitIndex = false,
  mouseX = 0,
  mouseY = 0,
  oneClickX = 0,
  oneClickY = 0,
  listOfBlocks = [],
  listOfFeatures = [],
  listOfLinks = [],
  listOfHierarchies = [
    [0]
  ],
  textWidth,
  input,

  standartBlock = {
    index: 0,
    text: 'New Mind',
    textColor: 'white',
    color: '#FFA500',
    shadowColor: '#191919',
    shadowBlur: 18,
    centerX: widthCanvas / 2,
    centerY: heightCanvas / 2,
    x: 0,
    y: 0,
    width: 105,
    height: 30,
    radius: 15,
    v1: 0,
    v2: 0,
    v3: 0,
    v4: 0,
    v5: 0,
    v6: 0,
    v7: 0,
    v8: 0,
    v9: 0,
    v10: 0,
  },

  standartFeature = {
    color: 'aqua',
    shadowBlur: 18,
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0,
    radius: 10,
  },

  standartLink = {
    index1: 0,
    index2: 0,
    color: '#FFA500',
    shadowColor: 'black',
    shadowBlur: 18,
    width: 2,
    beginX: 0,
    beginY: 0,
    endX: 0,
    endY: 0,
    v1: 0,
    v2: 0,
    v3: 0,
    v4: 0,
  };

// New Variables__________________________

let
  listOfColor = [
    '#7FFF00',
    '#00FFFF',
    '#FF00FF',
    '#FF4500',
    '#4682B4',
    '#4B0082',
    '#FF0000',
    '#e096e9',
    '#e68782',
    '#efa670',
    '#9ed56b',
    '#67d7c4',
    '#b4b4b4',
    '#0da7d3',
    '#3e8975',
    '#69b500',
    '#e8e525',
    '#ffaa38',
    '#a65427'
  ],

  lastWidth,
  lastHeight,
  lastColor,
  lastRadius,
  defaultText,
  zoomPlus = false,
  isAnimation = false,
  animateFeature = false,
  lastHitIndex = false,
  listOfActiveLinks = [],
  listOfMoovingBlocks = [],
  listOfMoovingLinks = [],
  inputColor,
  textOfPlaceholder;

// Check Of Hitting_____________________________

let result;
function checkHitAllBlocks () {
  result = false;
  for (let i = 0; i < listOfBlocks.length; i++) {
    if (mouseX > listOfBlocks[i].x & mouseX < listOfBlocks[i].x + listOfBlocks[i].width & mouseY > listOfBlocks[i].y - 30 & mouseY < listOfBlocks[i].y + listOfBlocks[i].height + 15) {
      result = i;
      break;
    };
  };
  return result;
};

function checkHitOneBlock (block) {
  result = false;
  if (mouseX > block.x & mouseX < block.x + block.width & mouseY > block.y - 30 & mouseY < block.y + block.height + 15) {
    result = lastHitIndex;
  };
  return result;
};

function checkHitOnFeature (feature) {
  result = false;
  if (mouseX > feature.x & mouseX < feature.centerX + feature.radius & mouseY > feature.centerY - feature.radius & mouseY < feature.centerY + feature.radius) {
    result = hitIndex;
  };
  return result;
};

// Activation Of Elements______________________

function activationOfElements() {
  if (activeBlocks === false) {
    hitIndex = checkHitAllBlocks();
    activeBlocks = hitIndex !== false;
  } else { //  activeBlocks === true
    hitIndex = checkHitOnFeature(listOfFeatures[hitIndex]);
    if (hitIndex !== false) { //  activeFeatures === true
      activeFeatures = true;
    } else {
      activeFeatures = false;
      hitIndex = checkHitOneBlock(listOfBlocks[lastHitIndex]);
      activeBlocks = hitIndex !== false;
    };
  };
};

// Event Functions_________________________

canvas.addEventListener('mousedown', e => {
  isMouseDown = true;
  oneClickX = e.offsetX;
  oneClickY = e.offsetY;
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  if (activeBlocks === true & activeFeatures === false) {
    listOfMoovingBlocks = getListOfMoovingBlocks();
    listOfMoovingLinks = getListOfMoovingLinks();
  };
});

canvas.addEventListener('mousemove', e => {
  if (isAnimation === false) {
    if (isMouseDown === false) { // Activation Features and Blocks
      activationOfElements();
      if (activeBlocks === true) { //  Activation  Block
        animateZoomPlus(); //  Animation Plus
      };
      if (lastHitIndex !== hitIndex) { //  Animation Minus
        animateZoomMinus();
      };
      if (activeFeatures === true) {
        animateActiveFeature()
      } else {
        animateFeature = false;
      };
    } else { //  isMouseDown === true
      if (activeBlocks === true & activeFeatures === false) { // Moving Block
        deleteAllInputs();
        moveBlock(e.offsetX, e.offsetY);
        doFormatFeature(hitIndex);
        doFormatLinks(listOfMoovingLinks);
        drawCanvas();
      };
      if (activeFeatures === true) { // Moving Feature
        deleteAllInputs();
        moveFeature(e.offsetX, e.offsetY);
        clearCanvas();
        drawLinks();
        drawLazerOfFeature(e.offsetX, e.offsetY);
        drawBlocks();
        drawFeature(hitIndex);
      };
      if (activeBlocks === false & activeFeatures === false) { // Moving Canvas
        moveCanvas(e.offsetX, e.offsetY);
        doFormatAllBlocks();
        doFormatLinks();
        drawCanvas(hitIndex);
      };
    };
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  };
});

canvas.addEventListener('mouseup', e => {
  isMouseDown = false;
  if (activeBlocks === true & activeFeatures === true) { // Create New Element
    doFormatFeature(hitIndex);
    createLinkOrBlock(e.offsetX, e.offsetY);
  };
  if (oneClickX == e.offsetX & oneClickY == e.offsetY) {
    if (activeBlocks === true & activeInput === false & activeFeatures === false) {
      createInputText();
    };
  };
  if (activeInputColor === false & activeBlocks === true) {
    drawCanvas(hitIndex);
    createInputColor();
  };
});

document.addEventListener ("keyup", e => {
  if (e.key == 'Delete' & activeBlocks === true) {
    deleteElement();
  };
  if (e.key == 'Enter') {
    deleteInput();
  };
  if (activeInput === true) {  // doDynamic Input
    doDynamicInputText();
  };
});

window.addEventListener('resize', e => {
  widthCanvas = canvas.width = window.innerWidth;
  heightCanvas = canvas.height = window.innerHeight;
  drawCanvas();
});

// Formating Elements______________________________

function doFormatAllBlocks() {
  listOfBlocks.forEach(function(block, i, listOfBlocks) {
    doFormatBlock(i);
  });
};

function doFormatBlock(index) {
  let block = listOfBlocks[index];
  block.x = block.centerX - block.width / 2;
  block.y = block.centerY - block.height / 2;
  let r = block.radius / 3;
  block.v1 = block.y + block.radius;
  block.v2 = block.y + r;
  block.v3 = block.x + r;
  block.v4 = block.x + block.radius;
  block.v5 = block.x + block.width - block.radius;
  block.v6 = block.x + block.width - r;
  block.v7 = block.x + block.width;
  block.v8 = block.y + block.height - block.radius;
  block.v9 = block.y + block.height - r;
  block.v10 = block.y + block.height;
};

function doFormatFeature(index) {
  let feature = listOfFeatures[index];
  let block = listOfBlocks[index];
  feature.centerX = block.centerX;
  feature.centerY = block.centerY - block.height / 2 - 20;
  feature.x = feature.centerX - feature.radius;
  feature.y = feature.centerY - feature.radius;
};

function doFormatLinks (someList = listOfLinks) {
  someList.forEach(function(link, i, someList) {
    link.beginX = listOfBlocks[link.index1].centerX;
    link.beginY = listOfBlocks[link.index1].centerY;
    link.endX = listOfBlocks[link.index2].centerX;
    link.endY = listOfBlocks[link.index2].centerY;
    if (Math.abs(link.beginX - link.endX) > Math.abs(link.beginY - link.endY)) {
      link.v1 = link.beginX;
      link.v2 = link.endY;
      link.v3 = link.endX;
      link.v4 = link.beginY;
      link.centerX = link.beginX + (link.endX - link.beginX) / 2;
      link.centerY = link.beginY + (link.endY - link.beginY) / 2;
    } else {
      link.v1 = link.endX;
      link.v2 = link.beginY;
      link.v3 = link.beginX;
      link.v4 = link.endY;
      link.centerX = link.beginX - (link.beginX - link.endX) / 2;
      link.centerY = link.beginY - (link.beginY - link.endY) / 2;
    };
  });
};

// Drawing Elements__________________________

function clearCanvas() {
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
};

function drawBlocks() {
  listOfBlocks.forEach(function(block, i, listOfBlocks) {
    ctx.beginPath();
    ctx.shadowColor = block.shadowColor;
    ctx.shadowBlur = block.shadowBlur;
    ctx.fillStyle = block.color;
    ctx.moveTo(block.x, block.v1);
    ctx.bezierCurveTo(block.x, block.v2, block.v3, block.y, block.v4, block.y);
    ctx.lineTo(block.v5, block.y);
    ctx.bezierCurveTo(block.v6, block.y, block.v7, block.v2, block.v7, block.v1);
    ctx.lineTo(block.v7, block.v8);
    ctx.bezierCurveTo(block.v7, block.v9, block.v6, block.v10, block.v5, block.v10);
    ctx.lineTo(block.v4, block.v10);
    ctx.bezierCurveTo(block.v3, block.v10, block.x, block.v9, block.x, block.v8);
    ctx.fill();
    // Draw Text
    ctx.beginPath();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.fillStyle = block.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '18px Arial';
    ctx.fillText(block.text, block.centerX, block.centerY + 1);
  });
};

function drawFeature(index) {
  let feature = listOfFeatures[index];
  // Circle
  ctx.beginPath();
  ctx.shadowColor = feature.color;
  ctx.shadowBlur = feature.shadowBlur;
  ctx.fillStyle = feature.color;
  ctx.arc(feature.centerX, feature.centerY, feature.radius, 0, 2 * Math.PI, false);
  ctx.fill();
  // Plus
  ctx.beginPath();
  ctx.shadowColor = '#191919';
  ctx.shadowBlur = 2;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  let r = feature.radius - 4;
  ctx.moveTo(feature.centerX - r, feature.centerY);
  ctx.lineTo(feature.centerX + r, feature.centerY);
  ctx.moveTo(feature.centerX, feature.centerY - r);
  ctx.lineTo(feature.centerX, feature.centerY + r);
  ctx.stroke();
};

function drawLinks() {
  listOfLinks.forEach(function(link, i, listOfLinks) {
    ctx.beginPath();
    ctx.shadowColor = link.shadowColor;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = link.shadowColor;
    ctx.shadowBlur = link.shadowBlur;
    ctx.strokeStyle = link.color;
    ctx.lineWidth = link.width;
    ctx.moveTo(link.beginX, link.beginY);
    ctx.bezierCurveTo(link.v1, link.v2, link.v3, link.v4, link.endX, link.endY);
    ctx.stroke();
  });
};

function drawLazerOfFeature (x1, y1) {
  ctx.beginPath();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = 'aqua';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = '#3c2c3e';
  ctx.lineWidth = 2;
  ctx.moveTo(listOfBlocks[hitIndex].centerX, listOfBlocks[hitIndex].centerY);
  ctx.lineTo(x1, y1);
  ctx.stroke();
};

function drawCanvas(index = false) {
  if (index === false) {
    clearCanvas();
    drawLinks();
    drawBlocks();
  } else {
    clearCanvas();
    drawLinks();
    drawBlocks();
    drawFeature(index);
  };
};

// Moving Elements________________________

function getListOfMoovingBlocks () {
  let i = 0;
  for (; i < listOfHierarchies.length; i++) {
    if (hitIndex == listOfHierarchies[i][0]) {
      break;
    };
  };
  return listOfHierarchies[i];
};

function getListOfMoovingLinks () {
  let list = [];
  listOfLinks.forEach(function(link, i, listOfLinks) {
    listOfMoovingBlocks.forEach(function(index, i, listOfMoovingBlocks) {
      if (link.index2 == index || link.index1 == index) {
        if (list.includes(link) === false) {
          list.push(link);
        };
      };
    });
  });
  return list;
};

function moveBlock (x1, y1) {
  let x = listOfBlocks[hitIndex].centerX - x1;
  let y = listOfBlocks[hitIndex].centerY - y1;
  listOfMoovingBlocks.forEach(function(index, i, listOfMoovingBlocks) {
    listOfBlocks[index].centerX -= x;
    listOfBlocks[index].centerY -= y;
    doFormatBlock(index);
  });
};

function moveCanvas (x1, y1) {
  let x = mouseX - x1;
  let y = mouseY - y1;
  listOfBlocks.forEach(function(block, i, listOfBlocks) {
    block.centerX -= x;
    block.centerY -= y;
  });
};

function moveFeature (x1, y1) {
  let feature = listOfFeatures[hitIndex];
  feature.centerX = x1;
  feature.centerY = y1;
  feature.x = feature.centerX - feature.radius;
  feature.y = feature.centerY - feature.radius;
};

// Creating Elements______________________

function addHierarchy () {
  listOfHierarchies.forEach(function(branch, i, listOfHierarchies) {
    if (hitIndex == branch[0]) {
      branch.push(listOfBlocks.length - 1);
      listOfHierarchies.push([listOfBlocks.length - 1])
    };
    branch.forEach(function(index, i, branch) {
      if (i > 0 & index == hitIndex) {
        branch.push(listOfBlocks.length - 1);
      };
    });
  });
};

function createNewBlock (x1, y1) {
  let newBlock = Object.assign({}, standartBlock);
  newBlock.text = 'branch ' + String(listOfBlocks.length);
  newBlock.width = Math.round(ctx.measureText(newBlock.text).width + 25);
  newBlock.centerX = x1;
  newBlock.centerY = y1;
  let color = listOfColor[getRndInteger(0, listOfColor.length)];
  while (color == lastColor) {
    color = listOfColor[getRndInteger(0, listOfColor.length)];
    console.log('Совпадение цвета исправлено')
  };
  newBlock.color = color;
  newBlock.index = listOfBlocks.length;
  listOfBlocks.push(newBlock);
  doFormatBlock(listOfBlocks.length - 1);
};

function createNewFeature () {
  let newFeature = Object.assign({}, standartFeature);
  listOfFeatures.push(newFeature);
};

function createNewLink (index = false) {
  let newLink = Object.assign({}, standartLink);
  newLink.index1 = hitIndex;
  if (index !== false) {
    newLink.index1 = hitIndex;
    newLink.index2 = index;
  } else {
    newLink.index2 = listOfBlocks.length - 1;
  };
  newLink.color = lastColor;
  let list = []
  list.push(newLink);
  doFormatLinks(list);
  listOfLinks.push(newLink);
};

function createNewElement (x1, y1) {
  createNewBlock(x1, y1);
  createNewLink();
  createNewFeature();
  addHierarchy();
};

function createLinkOrBlock (x1, y1) {
  let hit = checkHitAllBlocks();
  if (hit === false) {
    createNewElement(x1, y1);
  } else {
    createNewLink(hit);
  };
};

//  Creating Input________________________

function createInputText () {
  if (activeInput === false) {
    activeInput = true;
    document.body.insertAdjacentHTML('afterend', '<input id="input-text">');
    input = document.getElementById('input-text');
    if (listOfBlocks[hitIndex].text.split(' ')[0] == 'branch' || listOfBlocks[hitIndex].text == 'New Mind') {
      defaultText = listOfBlocks[hitIndex].text
      input.value = '';
    } else {
      input.value = listOfBlocks[hitIndex].text;
    };
    textWidth = Math.round(ctx.measureText(listOfBlocks[hitIndex].text).width);
    listOfBlocks[hitIndex].width = textWidth + 35;
    lastWidth = textWidth + 25;
    input.style.width = textWidth + 10 + 'px';
    input.style.left = listOfBlocks[hitIndex].centerX - textWidth / 2 - 5 + 'px';
    input.style.top = listOfBlocks[hitIndex].centerY - 10 + 'px';
    input.focus();
    doDynamicInputText();
  };
};

function doDynamicInputText () {
  if (input.value == '') {
    listOfBlocks[lastHitIndex].text = defaultText;
  } else {
    listOfBlocks[lastHitIndex].text = input.value;
    listOfBlocks[lastHitIndex].textColor = 'black';
  };
  textWidth = Math.round(ctx.measureText(listOfBlocks[lastHitIndex].text).width);
  listOfBlocks[lastHitIndex].width = textWidth + 35;
  lastWidth = textWidth + 25;
  input.style.width = textWidth + 10 + 'px';
  input.style.left = listOfBlocks[lastHitIndex].centerX - textWidth / 2 - 5 + 'px';
  doFormatBlock(lastHitIndex);
  drawCanvas(lastHitIndex);
};

function createInputColor () {
  if (activeInputColor === false) {
    activeInputColor = true;
    document.body.insertAdjacentHTML('afterend', '<input type="color" id="input-color">');
    inputColor = document.getElementById('input-color');
    inputColor.value = lastColor;
    inputColor.style.left = listOfBlocks[hitIndex].centerX - 12 + 'px';
    inputColor.style.top = listOfBlocks[hitIndex].centerY - 2 + lastHeight / 2 + 'px';
  };
};

function doDynamicInputColor () {
  if (lastColor != inputColor.value) {
    lastColor = inputColor.value;
    listOfLinks.forEach(function(link, i, listOfLinks) {
      if (link.index1 == lastHitIndex) {
        link.color = lastColor;
      };
    });
  };
};

function deleteInputColor () {
  if (activeInputColor === true) {
    doDynamicInputColor();
    inputColor.remove();
    activeInputColor = false;
  };
};

function deleteInputText () {
  if (activeInput === true) {
    doDynamicInputText();
    input.remove();
    activeInput = false;
  };
};

function deleteAllInputs () {
  deleteInputColor();
  deleteInputText();
};

// Delete Elements_________________________

function deleteElement () {
  listOfMoovingBlocks = getListOfMoovingBlocks();
  listOfMoovingLinks = getListOfMoovingLinks();

  let listOfDeleteBlocks = [];
  let listOfDeleteFeatures = [];
  let listOfDeleteHierarchies = [];

  listOfMoovingBlocks.forEach(function(index, i, listOfMoovingBlocks) {
    listOfDeleteBlocks.push(listOfBlocks[index]);
    listOfDeleteFeatures.push(listOfFeatures[index]);
  });

  for (let i = 0; i < listOfHierarchies.length; i++) {
    if (listOfHierarchies[i][0] == hitIndex) {
      listOfDeleteHierarchies = listOfHierarchies[i];
      listOfHierarchies.splice(i, 1);
      break
    };
  };
  zoomPlus = false;
  activeBlocks = false;
  activeFeatures = false;
  hitIndex = false;
  deleteAllInputs();
  deleteHierarchies(listOfDeleteHierarchies);
  deleteLinks(listOfMoovingLinks);
  deleteFeature(listOfDeleteFeatures);
  deleteBlocks(listOfDeleteBlocks);
  doFormatIndex();
  doFormatAllBlocks();
  doFormatLinks();
  drawCanvas();
};

function deleteHierarchies (listOfDelete) {
  listOfDelete.forEach(function(deleteIndex, e, listOfDelete) {
    listOfHierarchies.forEach(function(branch, i, listOfHierarchies) {
      if (branch.includes(deleteIndex) === true) {
        listOfHierarchies[i].splice(listOfHierarchies[i].indexOf(deleteIndex), 1);
      };
      if (branch.length == 0) {
        listOfHierarchies.splice(i, 1);
      };
    });
  });
};

function deleteFeature (listOfDelete) {
  listOfDelete.forEach(function(feature, i, listOfDelete) {
    listOfFeatures.splice(listOfFeatures.indexOf(feature), 1);
  });
};

function deleteBlocks (listOfDelete) {
  listOfDelete.forEach(function(block, i, listOfDeleteBlocks) {
    listOfBlocks.splice(listOfBlocks.indexOf(block), 1);
  });
};

function deleteLinks (listOfDelete) {
  listOfDelete.forEach(function(link, i, listOfDelete) {
    listOfLinks.splice(listOfLinks.indexOf(link), 1);
  });
};

function doFormatIndex () {
  listOfLinks.forEach(function(link, e, listOfLinks) {
    listOfBlocks.forEach(function(block, i, listOfBlocks) {
      // Begin Index Of Link______________________________________________
      if (link.index2 == block.index & block.index != i) {
        listOfHierarchies.forEach(function(branch, u, listOfHierarchies) {
          if (branch.includes(link.index2) == true) {
            branch[branch.indexOf(link.index2)] = i
          };
        });
        link.index2 = i;
        block.index = i;
        if (block.text.split(' ')[0] == 'branch') {
          block.text = 'branch ' + String(i);
        };
      };
      // End Index Of Link________________________________________________
      if (link.index1 == block.index & block.index != i) {
        listOfHierarchies.forEach(function(branch, u, listOfHierarchies) {
          if (branch.includes(link.index1) == true) {
            branch[branch.indexOf(link.index1)] = i
          };
        });
        link.index1 = i;
        block.index = i;
        if (block.text.split(' ')[0] == 'branch') {
          block.text = 'branch ' + String(i);
        };
      };
    });
  });
};

// Geting Of Random Color________________________________

function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Animations_________________________

function animateZoomPlus () {
  if (zoomPlus === false & isAnimation === false) {
    isAnimation = true;
    zoomPlus = true;
    document.body.style.cursor = 'pointer';
    //  Block
    let block = listOfBlocks[hitIndex];
    lastWidth = block.width;
    lastHeight = block.height;
    lastRadius = block.radius;
    lastColor = block.color;
    block.shadowColor = block.color
    block.color = 'white';
    block.shadowBlur = 0;
    //  Feature
    let feature = listOfFeatures[hitIndex];
    feature.centerX = block.centerX;
    feature.centerY = block.y;
    feature.radius = 4;
    feature.shadowBlur = 0;
    //  Links
    listOfActiveLinks = getActiveLinks();
    listOfActiveLinks.forEach(function(link, i, listOfActiveLinks) {
      link.shadowColor = link.color;
      link.shadowBlur = 0;
    });
    let timerId = setInterval(function() {
      //  Block
      block.width += 2;
      block.height += 4;
      block.radius -= 2;
      block.shadowBlur += 3;
      //  Feature
      feature.centerY -= 6;
      feature.radius += 1;
      feature.shadowBlur += 3;
      //  Links
      listOfActiveLinks.forEach(function(link, i, listOfActiveLinks) {
        link.shadowBlur += 3;
      });
      doFormatBlock(hitIndex);
      drawCanvas(hitIndex);
    }, 20);
    setTimeout(() => {
      clearInterval(timerId);
      //  Block
      block.shadowBlur = 18;
      //  Feature
      feature.shadowBlur = 18;
      feature.radius = 10;
      //  Links
      listOfActiveLinks.forEach(function(link, i, listOfActiveLinks) {
        link.shadowBlur = 18;
      });
      doFormatBlock(hitIndex);
      doFormatFeature(hitIndex);
      drawCanvas(hitIndex);
      createInputColor();
      lastHitIndex = hitIndex;
      isAnimation = false;
    }, 120);
  };
};

function animateZoomMinus () {
  if (zoomPlus === true & isAnimation === false) {
    isAnimation = true;
    let feature = listOfFeatures[lastHitIndex];
    let block = listOfBlocks[lastHitIndex];
    deleteAllInputs();
    document.body.style.cursor = 'default';

    let timerId = setInterval(function() {
      //  Block
      block.width -= 2;
      block.height -= 4;
      block.radius += 2;
      block.shadowBlur -= 3;
      //  Feature
      feature.radius -= 1;
      feature.shadowBlur -= 3;
      //  Links
      listOfActiveLinks.forEach(function(link, i, listOfActiveLinks) {
        link.shadowBlur -= 3;
      });
      doFormatBlock(lastHitIndex);
      drawCanvas(lastHitIndex);
    }, 20);

    setTimeout(() => {
      clearInterval(timerId);
      //  Block
      block.width = lastWidth;
      block.height = lastHeight;
      block.radius = lastRadius;
      block.color = lastColor;
      block.shadowColor = '#191919';
      block.shadowBlur = 18;
      //  Feature
      feature.shadowBlur = 18;
      feature.radius = 10;
      //  Links
      listOfActiveLinks.forEach(function(link, i, listOfActiveLinks) {
        link.shadowColor = 'black';
        link.shadowBlur = 18;
      });
      doFormatBlock(lastHitIndex);
      doFormatFeature(lastHitIndex);
      drawCanvas();
      zoomPlus = false;
      isAnimation = false;
    }, 120);
  };
};

function animateActiveFeature () {
  if (isAnimation === false & activeFeatures === true & animateFeature === false) {
    isAnimation = true;
    animateFeature = true;
    let feature = listOfFeatures[hitIndex];
    let rotateXY = 6;
    let lastFeatureCenterX = feature.centerX;
    let lastFeatureCenterY = feature.centerY;
    let x = 0;
    let y = 0;

    let timerId = setInterval(function() {
      rotateXY -= 0.3;
      if (rotateXY < 3) {
        y -= 1
      } else {
        y += 1
      };
      feature.centerX = x * Math.cos(rotateXY) + y * Math.sin(rotateXY);
      feature.centerY = -x * Math.sin(rotateXY) + y * Math.cos(rotateXY);
      feature.centerX += lastFeatureCenterX
      feature.centerY += lastFeatureCenterY
      drawCanvas(hitIndex);
    }, 20);

    setTimeout(() => {
      clearInterval(timerId);
      doFormatFeature(hitIndex);
      drawCanvas(hitIndex);
      isAnimation = false;
    }, 420);
  };
};

// Getting Active Links For Animation____________________

function getActiveLinks () {
  let list = [];
  listOfLinks.forEach(function(link, i, listOfLinks) {
    if (hitIndex == link.index1) {
      list.push(link);
    };
  });
  return list
};

// Start_________________________________________

listOfBlocks.push(Object.assign({}, standartBlock));
listOfFeatures.push(Object.assign({}, standartFeature));
doFormatBlock(0);
drawCanvas();
