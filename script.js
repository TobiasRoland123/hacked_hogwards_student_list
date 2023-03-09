"use strict";

// Global variables is created
const studentJsonUrl = "https://petlatkea.dk/2021/hogwarts/students.json";
const studentBloodStatusUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

let students;
let studentsBloodStatus;

const allStudents = new Array();

const settings = {
  filterBy: "all",
  filterType: "",
  sortBy: "name",
  sortDir: "asc",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  houseImg: "",
  gender: "",
  bloodstatus: "",
  responsibilities: "",
  prefect: false,
  expelled: "",
};

// listens for all content to load, then calls function start
document.addEventListener("DOMContentLoaded", start);

// this function cals the getData function
function start() {
  document.querySelectorAll("#filter_select optgroup option").forEach((option) => option.addEventListener("click", selectFilter));
  document.querySelectorAll('[data-action="sort"]').forEach((button) => button.addEventListener("click", selectSort));
  getData();
}

/* this function fetches the data from the json url, and puts 
the value of the json file on the variable students */
async function getData() {
  const respons = await fetch(studentJsonUrl);
  const responsBlood = await fetch(studentBloodStatusUrl);

  students = await respons.json();
  studentsBloodStatus = await responsBlood.json();

  console.log(studentsBloodStatus);
  //   calls the clean data function and gives the function the data from the students variable
  cleanStudentData(students, studentsBloodStatus);
  displayList(allStudents);
}

function cleanStudentData(students, studentsBloodStatus) {
  /*Runs through each student and each time a "newStudent" is created.
  THen is starts to go through the data of the student   */
  students.forEach((student) => {
    const newStudent = Object.create(Student);
    cleanStudentNames(newStudent, student);
    cleanStudentsHouse(newStudent, student);
    cleanStudentsHouseImg(newStudent, student);
    cleanStudentGender(newStudent, student);
    cleanStudentImage(newStudent, student);

    cleanBloodStatus(newStudent, student, studentsBloodStatus);
    // console.log(`${newStudent.firstName} is: ${newStudent.bloodstatus}`);

    allStudents.push(newStudent);
  });

  //shows all students in the console
  // console.table(allStudents);
}
//cleans all parts of student names, in smaller bites
function cleanStudentNames(newStudent, student) {
  // removes any spaces before and after students full name
  student.fullname = student.fullname.trim();
  //   Gets the first name from student, and sets it equal to first name of newStudent
  newStudent.firstName = getFirstName(student);
  //   Gets the last name from student, and sets it equal to last name of newStudent
  newStudent.lastName = getLastName(student);
  //   Gets the middle name from student, and sets it equal to middle name of newStudent
  newStudent.middleName = getMiddleName(student);
  //   Gets the nick name from student, and sets it equal to nick name of newStudent
  newStudent.nickName = getNickName(student);

  //   pushes all the information to the all students Array.
  return newStudent;
}

function getFirstName(student) {
  //   console.log(`_${student.fullname}_`);
  let studentFirstName;
  if (student.fullname.includes(" ")) {
    studentFirstName = student.fullname.substring(0, student.fullname.indexOf(" "));
  } else {
    studentFirstName = student.fullname.substring(0);
  }
  return `${studentFirstName[0].toUpperCase()}${studentFirstName.substring(1).toLowerCase()}`;
}

function getLastName(student) {
  let studentLastName;

  if (student.fullname.includes(" ")) {
    studentLastName = student.fullname.substring(student.fullname.lastIndexOf(" ") + 1);

    if (student.fullname.includes("-")) {
      studentLastName = student.fullname.substring(student.fullname.indexOf("-") + 1);
    }
  } else {
    studentLastName = "unknown";
  }

  return `${studentLastName[0].toUpperCase()}${studentLastName.substring(1).toLowerCase()}`;
}

function getMiddleName(student) {
  let studentMiddleName;

  if (student.fullname.includes("-")) {
    studentMiddleName = student.fullname.substring(student.fullname.indexOf(" ") + 1, student.fullname.indexOf("-"));
  } else {
    studentMiddleName = student.fullname.substring(student.fullname.indexOf(" ") + 1, student.fullname.lastIndexOf(" "));
  }
  if (student.fullname.substring(student.fullname.indexOf(" "), student.fullname.lastIndexOf(" ")) === "") {
    return undefined;
  } else {
    return `${studentMiddleName[0].toUpperCase()}${studentMiddleName.substring(1)}`;
  }
}

function getNickName(student) {
  let studentNickName;
  if (student.fullname.includes(`"`)) {
    //   console.log(`nick name`);
    studentNickName = student.fullname.substring(student.fullname.indexOf(`"`) + 1, student.fullname.lastIndexOf(`"`));
    return `${studentNickName[0].toUpperCase()}${studentNickName.substring(1).toLowerCase()}`;
  } else {
    return undefined;
  }
}

function cleanStudentsHouse(newStudent, student) {
  // trims the ends of student.house
  student.house = student.house.trim();

  newStudent.house = getStudentHouse(student);

  return newStudent;
}

function cleanStudentsHouseImg(newStudent, student) {
  newStudent.houseImg = `${newStudent.house}.svg`;

  return newStudent;
}

function getStudentHouse(student) {
  let studentHouse;

  studentHouse = student.house;
  //   console.log(`_${newStudent.house}_`);
  return `${studentHouse[0].toUpperCase()}${studentHouse.substring(1).toLowerCase()}`;
}

function cleanStudentGender(newStudent, student) {
  student.gender = student.gender.trim();

  newStudent.gender = getStudentGender(student);

  return newStudent;
}

function getStudentGender(student) {
  return `${student.gender[0].toUpperCase()}${student.gender.substring(1)}`;
}

function cleanStudentImage(newStudent, student) {
  if (newStudent.lastName === "Unknown") {
    newStudent.image = `student_placeholder_image.jpg`;
  } else {
    newStudent.image = getStudentImage(newStudent);
  }

  return newStudent;
}

function getStudentImage(newStudent) {
  if (newStudent.lastName === "Patil") {
    return `${newStudent.lastName[0].toLowerCase()}${newStudent.lastName.substring(1)}_${newStudent.firstName.toLowerCase()}.png`;
  } else {
    return `${newStudent.lastName.toLowerCase()}_${newStudent.firstName[0].toLowerCase()}.png`;
  }
}

function cleanBloodStatus(newStudent, student, studentsBloodStatus) {
  let studBloodStat;

  newStudent.bloodstatus = checkBloodStatus(studentsBloodStatus);

  function checkBloodStatus(studentsBloodStatus) {
    if (studentsBloodStatus.half.includes(newStudent.lastName) && studentsBloodStatus.pure.includes(newStudent.lastName)) {
      return `Half`;
    } else if (studentsBloodStatus.half.includes(newStudent.lastName)) {
      return `Half`;
    } else if (studentsBloodStatus.pure.includes(newStudent.lastName)) {
      return `Pure`;
    } else {
      return `Muggle`;
    }
  }
  return newStudent;
}
function displayList(students) {
  document.querySelector("#student_list").innerHTML = "";

  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create a clone of student template
  const clone = document.querySelector("#student_template").content.cloneNode(true);

  //set all the date for the student template clone
  clone.querySelector("[data-field=image]").src = "images/" + student.image;
  clone.querySelector("[data-field=first_name]").textContent = student.firstName;
  clone.querySelector("[data-field=last_name]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  clone.querySelector(".student").addEventListener("click", () => showDetails(student));

  document.querySelector("#student_list").appendChild(clone);
}

function showDetails(student) {
  const popUp = document.querySelector("#popup");
  popUp.style.display = "block";

  popUp.querySelector("[data-field=image]").src = "images/" + student.image;
  popUp.querySelector("[data-field=first_name]").textContent = student.firstName;
  popUp.querySelector("[data-field=middle_name]").textContent = student.middleName;
  popUp.querySelector("[data-field=last_name]").textContent = student.lastName;
  popUp.querySelector("[data-field=house_img]").src = `images/house_crests/${student.houseImg}`;
  popUp.querySelector("[data-field=blood_status]").src = `images/bloodstatus_img/${student.bloodstatus}.png`;
  // popUp.querySelector("[data-field=responsibilities]").textContent = student.responsibilities;
  // popUp.querySelector("[data-field=expelled]").textContent = student.expelled;

  popUp.querySelector('[data-action="set_prefect"]').addEventListener("click", clickPrefect);

  // Make prefect
  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    // buildList();
  }
  popUp.querySelector('[data-action="close"]').addEventListener("click", () => (popUp.style.display = "none"));
}

/*A new list is build from the critiria from */
function buildList() {
  // Creates a veriable "currentList" and gives it the filtered value of allStudents
  const currentList = filterList(allStudents);
  // Creates variable "sortedList" and gives it the value of the sorted version of currentList
  const sortedList = sortlist(currentList);

  // displays currentList
  displayList(currentList);
}

// this function tries to make a prefect if it's possible
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  console.log(`these are the prefects: `, prefects);
  const numberOfPrefects = prefects.length;
  console.log(`number of prefects is: ${numberOfPrefects}`);
  const other = prefects.filter((student) => student.house === selectedStudent.house).shift();

  // if there is another of same type
  if (other !== undefined) {
    console.log("there can be only one prefect of each house");
    removeOther(other);
  } else if (numberOfPrefects >= 2) {
    console.log("there can be only be two prefects!");
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }
}

function removeAorB(prefectA, prefectB) {
  console.log(`you should remove ${prefectA.firstName} or ${prefectB.fullname}`);
}

function removeOther(other) {
  console.log(`You should remove ${other.firstName}`);
}

function makePrefect(student) {
  student.prefect = true;
  console.log(`${student.firstName} prefect status is now:`, student.prefect);
}

// Here the the sortBy variable gets the value of the button that was pressed, and same with sortDir
function selectSort(event) {
  // makes sure to change sorting direction everytime a button os pressed twice
  if (settings.sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else if (settings.sortDir === "desc") {
    event.target.dataset.sortDirection = "asc";
  }

  // sets sortBy and sortDir
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // calls the setSort function with sortBy and sortDir as parameters
  setSort(sortBy, sortDir);
}

// sets settings.sortBy and settings.sortDir and then calls buildList
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

// sorts the list by settings.sortBy
function sortlist(sortedList) {
  let direction = 1;

  // controls which way list is sorted
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  // gives sotedList the value of sortedList, after it has been through the sort function.
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(elementA, elementB) {
    if (elementA[settings.sortBy] < elementB[settings.sortBy]) {
      return -1 * direction;
    } else if (elementA[settings.sortBy] > elementB[settings.sortBy]) {
      return 1 * direction;
    } else {
      return 0;
    }
  }

  // returns the sotedList
  return sortedList;
}

/* this function sets the filter variable to the value og 
the dropdown menu in the dom it also looks at the type of the option which is chosen, 
 so it knows if its house, bloodstatus and so on*/
function selectFilter(event) {
  let filter = document.querySelector("#filter_select").value;
  let filterType = this.dataset.type;

  setFilter(filter, filterType);
}

/* Sets the settings.filterBy and filterType to the values from the dropdown menu.
The reason to use global variables is so the build list knows what filter is selcted*/
function setFilter(filter, filterType) {
  settings.filterBy = filter;
  settings.filterType = filterType;

  // build list is called.
  buildList();
}

// this function decides which filter allStudents should be run through
function filterList() {
  // if filtertype is equal to house run through house filter
  if (settings.filterType === "all") {
    console.log(settings.filterBy);
    return allStudents;
  }
  // if the studentType is none of the above then just return allStudents
  else {
    return allStudents.filter(filterStudents);
  }
}

// this function return only the students who belongs to the house equal to settings.filterBy
function filterStudents(student) {
  // this returns if student[settings.filterType] is equal to the value we want to filter by
  /* because the student object doesn't have a settings property we need to use [] and 
  put it inside of  that to choose the exact porperty*/
  return student[`${settings.filterType}`] === settings.filterBy;
}
