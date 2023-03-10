"use strict";

// Global variables is created
const studentJsonUrl = "https://petlatkea.dk/2021/hogwarts/students.json";
const studentBloodStatusUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

let students;
let studentsBloodStatus;

const allStudents = new Array();
const expelledStudents = new Array();

const settings = {
  filterBy: "all",
  filterType: "all",
  sortBy: "firstName",
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
  expelled: "false",
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

  //   calls the clean data function and gives the function the data from the students variable
  cleanStudentData(students, studentsBloodStatus);

  buildList();
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
  console.table(allStudents);
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

  clone.querySelector(".student img").addEventListener("click", () => showDetails(student));

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
  popUp.querySelector("[data-field=expelled]").textContent = `Expelled status; ${checkIfExpelled(student)}`;
  popUp.querySelector("[data-field=prefect]").textContent = `Prefect status: ${checkIfPrefect(student)}`;
  popUp.querySelector("[data-field=inquisitorial_squad]").textContent = `Repsonsebilyties: ${checkIfMember(student)}`;

  popUp.querySelector('[data-action="set_prefect"]').addEventListener("click", clickPrefect);
  popUp.querySelector('[data-action="expell_student"]').addEventListener("click", expellStudentClicked);
  popUp.querySelector('[data-action="make_is_member"]').addEventListener("click", makeMemberClicked);

  popUp.querySelector('[data-action="close"]').addEventListener("click", () => {
    popUp.querySelector('[data-action="set_prefect"]').removeEventListener("click", clickPrefect);
    popUp.querySelector('[data-action="expell_student"]').removeEventListener("click", expellStudentClicked);
    popUp.querySelector('[data-action="make_is_member"]').removeEventListener("click", makeMemberClicked);
    popUp.style.display = "none";
  });

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    //  Updates the status of prefect in view
    popUp.querySelector("[data-field=prefect]").textContent = `Prefect status: ${checkIfPrefect(student)}`;
  }
  function expellStudentClicked() {
    expellStudent(student);

    popUp.querySelector("[data-field=expelled]").textContent = `Expelled status; ${checkIfExpelled(student)}`;
  }

  function makeMemberClicked() {
    if (student.responsibilities === "Inquisitorial Squad") {
      student.responsibilities = "No responsibilities";
    } else {
      tryToMakeStudentMember(student);
    }
    popUp.querySelector("[data-field=inquisitorial_squad]").textContent = `Repsonsebilyties: ${checkIfMember(student)}`;
  }
}

function expellStudent(student) {
  student.expelled = true;
  addToExpelledAndRemoveFromAll(student);
  // document.querySelector("#popup").style.display = "none";
  buildList();
}

function addToExpelledAndRemoveFromAll(student) {
  expelledStudents.push(allStudents.shift(student));
}

function tryToMakeStudentMember(student) {
  if (student.bloodstatus === "Pure" || student.house === "Slytherin") {
    makeMemberOfInquisitorialSquad(student);
  } else {
    tellWhyStudentCannotBeMember(student);
  }
}

function makeMemberOfInquisitorialSquad(student) {
  student.responsibilities = "Inquisitorial Squad";
}

function tellWhyStudentCannotBeMember(student) {
  document.querySelector("#cannotBeMember").classList.add("show");
  document.querySelector("#cannotBeMember .closebutton").addEventListener("click", closeDigalog);
  document.querySelector("#cannotBeMember .student1_name").textContent = student.firstName;

  function closeDigalog() {
    document.querySelector("#cannotBeMember").classList.remove("show");
    document.querySelector("#cannotBeMember .closebutton").removeEventListener("click", closeDigalog);
  }
}

// function removeFromList(student){

// }

// try to make student a prefect
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  // const numberOfPrefects = prefects.length;
  const other = prefects
    .filter((student) => student.house === selectedStudent.house && student.gender === selectedStudent.gender)
    .shift();
  console.log(`prefects:`, prefects);
  console.log(`other:`, other);
  // if there is another of same house
  if (other !== undefined) {
    if (other.gender === selectedStudent.gender) {
      removeOther(other);
    } else {
      makePrefect(selectedStudent);
    }
  } else {
    makePrefect(selectedStudent);
  }
  function removeOther(other) {
    // ask user to remove or ignore other
    document.querySelector("#onlyOnePrefectFromEachGenderFromEachHouse").classList.add("show");
    document.querySelector("#onlyOnePrefectFromEachGenderFromEachHouse .closebutton").addEventListener("click", closeDigalog);
    document
      .querySelector("#onlyOnePrefectFromEachGenderFromEachHouse [data-action=remove1]")
      .addEventListener("click", clickRemoveOther);

    document.querySelector("#onlyOnePrefectFromEachGenderFromEachHouse .student1").textContent = other.firstName;

    function closeDigalog() {
      document.querySelector("#onlyOnePrefectFromEachGenderFromEachHouse").classList.remove("show");
      document
        .querySelector("#onlyOnePrefectFromEachGenderFromEachHouse .closebutton")
        .removeEventListener("click", closeDigalog);
      document
        .querySelector("#onlyOnePrefectFromEachGenderFromEachHouse [data-action=remove1]")
        .removeEventListener("click", clickRemoveOther);
    }

    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);

      closeDigalog();
    }
  }

  function removePrefect(student) {
    student.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
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
    // console.log(settings.filterBy);
    return allStudents;
  } else if (settings.filterType === "expelled") {
    return expelledStudents;
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

function checkIfPrefect(student) {
  if (student.prefect === true) {
    return `True`;
  } else {
    return `False`;
  }
}

function checkIfExpelled(student) {
  if (student.expelled === true) {
    return `True`;
  } else {
    return `False`;
  }
}

function checkIfMember(student) {
  if (student.responsibilities === "Inquisitorial Squad") {
    return `Inquisitorial Squad`;
  } else {
    return `No responsibilities`;
  }
}
