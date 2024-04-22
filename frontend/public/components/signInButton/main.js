const input = document.querySelector("#input"),
  spinner = document.querySelector(".spinner"),
  button = document.querySelector("button");

const updateUi = (value) => {
  console.log("value", value);
  spinner.classList.remove("visible");
  let invalid = false;
  if (value.length > 15) {
    invalid = true
  }

  button.disabled = invalid;
  input.classList.toggle("valid", !invalid);
};

const debounce = (callback, time) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback.apply(null, args);
    }, time);
  };
};

const handleStartTyping = () => {
  spinner.classList.add("visible");
};

const handleChange = debounce((input) => {
  const { value } = input.target;

  console.log("input", input);

  input.target.classList.toggle("has-value", value);

  updateUi(value);
}, 500);
