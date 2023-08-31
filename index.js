let array = [];
const speed = 100; 

function generateArray() {
  const size = parseInt(document.getElementById("arraySize").value);
  array = [];
  const arrayContainer = document.getElementById("arrayContainer");
  arrayContainer.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 100) + 1;
    array.push(value);
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 3}px`;
    arrayContainer.appendChild(bar);
  }
}

async function performSort() {
  const sortType = document.getElementById("sortType").value;
  if (sortType === "bubble") {
    await bubbleSort();
  } else if (sortType === "insertion") {
    await insertionSort();
  } else if (sortType === "selection") {
    await selectionSort();
  } else if (sortType === "merge") {
    await mergeSort(0, array.length - 1);
  } else if (sortType === "quick") {
    await quickSort(0, array.length - 1);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      highlight(j, j + 1, "comparison");
      await sleep(speed);
      if (array[j] > array[j + 1]) {
        swap(j, j + 1);
        updateView(j, j + 1);
        await sleep(speed);
      }
      removeHighlight(j, j + 1);
    }
  }
  highlightAllSorted();
}

async function insertionSort() {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let current = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > current) {
      highlight(j, j + 1, "comparison");
      await sleep(speed);
      array[j + 1] = array[j];
      updateView(j + 1);
      await sleep(speed);
      removeHighlight(j, j + 1);
      j--;
    }
    array[j + 1] = current;
    updateView(j + 1);
    await sleep(speed);
  }
  highlightAllSorted();
}

async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      highlight(minIndex, j, "comparison");
      await sleep(speed);
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      removeHighlight(minIndex, j);
    }
    swap(i, minIndex);
    updateView(i, minIndex);
    await sleep(speed);
  }
  highlightAllSorted();
}

async function mergeSort(left, right) {
  if (left >= right) {
    return;
  }
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
  highlightAllSorted();
}

async function merge(left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  const L = new Array(n1);
  const R = new Array(n2);

  for (let i = 0; i < n1; i++) {
    L[i] = array[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = array[mid + 1 + j];
  }

  let i = 0;
  let j = 0;
  let k = left;

  while (i < n1 && j < n2) {
    highlight(left + i, mid + 1 + j, "comparison");
    await sleep(speed);
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    updateView(k);
    await sleep(speed);
    removeHighlight(left + i, mid + 1 + j);
    k++;
  }

  while (i < n1) {
    array[k] = L[i];
    updateView(k);
    await sleep(speed);
    i++;
    k++;
  }

  while (j < n2) {
    array[k] = R[j];
    updateView(k);
    await sleep(speed);
    j++;
    k++;
  }
}

async function quickSort(low, high) {
  if (low < high) {
    const pivotIndex = await partition(low, high);
    await quickSort(low, pivotIndex - 1);
    await quickSort(pivotIndex + 1, high);
  }
  highlightAllSorted();
}

async function partition(low, high) {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    highlight(j, high, "comparison");
    await sleep(speed);
    if (array[j] < pivot) {
      i++;
      swap(i, j);
      updateView(i, j);
      await sleep(speed);
    }
    removeHighlight(j, high);
  }
  swap(i + 1, high);
  updateView(i + 1, high);
  await sleep(speed);
  return i + 1;
}

function highlight(index1, index2, type) {
  const bars = document.querySelectorAll(".bar");
  if (type === "comparison") {
    bars[index1].style.backgroundColor = "#ff0000"; 
    bars[index2].style.backgroundColor = "#ff0000";
  } else {
    bars[index1].style.backgroundColor = "#00ff00"; 
    bars[index2].style.backgroundColor = "#00ff00";
  }
}

function removeHighlight(index1, index2) {
  const bars = document.querySelectorAll(".bar");
  bars[index1].style.backgroundColor = "#007bff"; 
  bars[index2].style.backgroundColor = "#007bff";
}

function swap(i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function updateView(...indices) {
  const bars = document.querySelectorAll(".bar");
  for (const index of indices) {
    bars[index].style.height = `${array[index] * 3}px`;
  }
}

function highlightAllSorted() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "#28a745"; 
  }
}
document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    const heading = document.querySelector("h1");
    heading.style.filter = "none"; 
    applyMosaicEffect(heading); 
  }, 800); 
});

function applyMosaicEffect(element) {
  const text = element.textContent;
  const words = text.split(" ");
  element.innerHTML = words
    .map(word => `<span class="mosaic">${word}</span>`)
    .join(" ");
}