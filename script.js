"use strict";
{
  const types = {
    run: {
      easy: "Easy Run",
      long: "Long Run",
      fartlek: "Fartlek",
      speed: "Speedwork",
      hills: "Hills",
      tempo: "Tempo",
    },
    strength: "Strength",
    crosstrain: {
      crosstrain: "Crosstrain",
      swim: "Swim",
      bike: "Bike",
    },
  };

  document.querySelector("#start-date").valueAsDate = new Date();
  document.querySelector("#end-date").min = getFormattedDate(new Date());
//   document.querySelector("#end-date").valueAsDate = new Date("05/25/2024");
  let dayCount = 0;
  let startDate, endDate, firstDay;
  document.querySelector("#create-plan").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const start = new Date(formData.get("start"));
    const end = new Date(formData.get("end"));

    const length = weeksBetween(start, end);
    dayCount = 0;
    firstDay = start;

    for (let i = 1; i <= length; i++) {
      document.querySelector("#plan").append(week(i));
    }
  });

  const weeksBetween = (d1, d2) =>
    Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));

  const week = (i) => {
    const $week = document.createElement("div");
    $week.classList.add("week");
    $week.innerHTML = `<h2> Week ${i}</h2>`;
    $week.append(days());

    return $week;
  };

  const days = () => {
    const $days = document.createElement("div");
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const traditionalDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    $days.classList.add("days");

    for (let i = 0; i < 7; i++) {
      dayCount++;

      if (!startDate && traditionalDays[firstDay.getDay()] === daysOfWeek[i]) {
        console.log(firstDay)
        startDate = new Date(firstDay);
      } else {
        console.log(startDate)
      }

      const $day = document.createElement("div");
      $day.classList.add("day");

      const dayHeader = document.createElement('div')
      dayHeader.classList.add('day-header');

      dayHeader.innerHTML = `<span> ${daysOfWeek[i]}</span> <span> Day ${dayCount}</span>`;

      if (startDate) {
        dayHeader.innerHTML += `<span> ${getFormattedDate(startDate)} </span>`
      }

      $day.append(dayHeader)

      addToDayForm($day);
      $days.append($day);
    }

    return $days;
  };

  const addToDayForm = ($day) => {
    const $form = document.createElement("form");
    $form.innerHTML = `
        <form> 
            <label>
                Distance
                <input type="number" value="1" name="distance" />
            </label>
            
            <label> 
                <select name="unit"> 
                    <option value="minutes"> Minutes </option>
                    <option value="miles" selected> Miles </option>
                </select>
            </label>

            <label> 
                <select name="type"> 
                    ${getTypesOption(types)}
                </select>
            </label>

            <label>
                <textarea name="description"></textarea> 
            </label>

            <button> Add Workout </button>
        </form>
        `;

    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData($form);

      const distance = data.get("distance");
      const unit = data.get("unit");
      const type = data.get("type");
      const description = data.get("description");

      const $workout = document.createElement("div");
      $workout.innerHTML = `
            <h3> ${getType(types, type)} </h3>
            <h4> ${distance} ${unit} </h4>
            <p> ${description} </p>
        `;

      $day.append($workout);
      $form.reset();
    });

    $day.append(showHide($form, "Add Workout"));
  };

  const getTypesOption = (typesObj) => {
    let types = "";

    for (const key in typesObj) {
      const value = typesObj[key];
      if (typeof value === "object") {
        types += getTypesOption(value);
      } else {
        types += `<option value="${key}"> ${value}</option>`;
      }
    }

    return types;
  };

  const getType = (typesObj, key) => {
    for (const type in typesObj) {
      const value = typesObj[type];

      if (key === type) {
        return value;
      }

      console.log(key, value);
      if (typeof value === "object") {
        const toCheck = getType(value, key);

        if (toCheck !== null) {
          return toCheck;
        }
      }
    }

    return null;
  };

  const showHide = ($elem, showMessage = "Show", hideMessage = "Hide") => {
    const $showHide = document.createElement("div");

    const $button = document.createElement("button");
    $elem.classList.add("hidden");

    $button.addEventListener("click", () => {
      $elem.classList.toggle("hidden");

      $button.innerHTML = $elem.classList.contains("hidden")
        ? showMessage
        : hideMessage;
    });

    $button.innerText = showMessage;
    $showHide.append($elem);
    $showHide.append($button);

    $elem.addEventListener("submit", () => $button.click(0));

    return $showHide;
  };

  function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  document.querySelector("#create-plan button").click();
}
