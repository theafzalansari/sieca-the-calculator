let equalPressed = 0;
let buttonInput = document.querySelectorAll(".button");
let input = document.getElementById("input");
let equal = document.getElementById("equal");
let clear = document.getElementById("clear");
let erase = document.getElementById("erase");
let mode = "degrees";
let historyContent = document.getElementById("historyContent");

window.onload = () => {
  input.value = "";
};

let toggleMode = document.getElementById("toggleMode");
toggleMode.addEventListener("click", () => {
  mode = mode === "degrees" ? "radians" : "degrees";
  toggleMode.textContent = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
});


document.addEventListener("keydown", (event) => {
  if (!isNaN(event.key) || ["+", "-", "*", "/", ".", "(", ")"].includes(event.key)) {
    input.value += event.key;
  } else if (event.key === "Enter") {
    equal.click(); 
  } else if (event.key === "Backspace") {
    input.value = input.value.slice(0, -1);
  } else if (event.key.toLowerCase() === "c") {
    input.value = ""; 
  }
});


buttonInput.forEach((buttonClass) => {
  buttonClass.addEventListener("click", (event) => {
    if (equalPressed === 1) {
      equalPressed = 0;
    }
    let value = event.target.dataset.number;

    if (value === "AC") {
      input.value = "";
      return;
    }

    if (value === "DEL") {
      input.value = input.value.slice(0, -1);
      return;
    }

    input.value += value;
  });
});

equal.addEventListener("click", () => {
  equalPressed = 1;
  let inputValue = input.value;

  try {
  let expression = inputValue
  .replaceAll("^2", "**2")
  .replaceAll("^3", "**3")
  .replaceAll("√", "Math.sqrt")
  .replaceAll("∛", "Math.cbrt")
  .replace(/(\d+)!/g, (_, num) => factorial(Number(num)));

if (mode === "degrees") {
  expression = expression
    .replaceAll("sin(", "Math.sin(Math.PI/180*")
    .replaceAll("cos(", "Math.cos(Math.PI/180*")
    .replaceAll("tan(", "Math.tan(Math.PI/180*");
} else {
  expression = expression
    .replaceAll("sin(", "Math.sin(")
    .replaceAll("cos(", "Math.cos(")
    .replaceAll("tan(", "Math.tan(");
}


    let result = eval(expression);
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      throw new Error("Invalid expression");
    }

    input.value = Number.isInteger(result) ? result : result.toFixed(2);
    addToHistory(expression, input.value);
  } catch (error) {
    alert("Error: " + error.message);
  }
});

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function addToHistory(expression, result) {
  let divItem = document.createElement("div");
  let span = document.createElement("span");
  let button = document.createElement("button");

  divItem.className = "historyItem";
  divItem.style.display = "flex";
  divItem.style.justifyContent = "space-between";

  span.textContent = `${expression} = ${result}`;
  span.dataset.userInput = expression;
  span.style.cursor = "pointer";
  span.style.color = "white";

  button.textContent = "Delete";
  button.className = "btn-sm";
  button.style.backgroundColor = "red";
  button.style.color = "white";

  button.addEventListener("click", () => divItem.remove());
  span.addEventListener("click", () => {
    input.value = span.dataset.userInput;
  });

  divItem.appendChild(span);
  divItem.appendChild(button);
  historyContent.appendChild(divItem);
}
