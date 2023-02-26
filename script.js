"use strict";

// Global variables is created
const studentJsonUrl = "https://petlatkea.dk/2021/hogwarts/students.json";
const studentBloodStatusUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

let students;
let studentsBloodStatus;

const allStudents = new Array();

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  bloodstatus: "",
};

// listens for all content to load, then calls function start
document.addEventListener("DOMContentLoaded", start);

// this function cals the getData function
function start() {
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
}

function cleanStudentData(students, studentBloodStatus) {
  console.table(students);
  console.log(`this is the first item in pure blood: ${studentBloodStatus.half[0]}`);

  /*Runs through each student and each time a "newStudent" is created.
  THen is starts to go through the data of the student   */
  students.forEach((student) => {
    const newStudent = Object.create(Student);
    cleanStudentNames(newStudent, student);
    cleanStudentsHouse(newStudent, student);
    cleanStudentGender(newStudent, student);
    // cleanBloodStatus(newStudent, student, studentBloodStatus);
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

function cleanBloodStatus(newStudent, student, studentBloodStatus) {
  let studBloodStat;

  newStudent.bloodStatus = checkBloodStatus(student, studentBloodStatus);
  function checkBloodStatus(student, studentBloodStatus) {
    console.log(newStudent.firstName);
    if (studentBloodStatus.half.includes(newStudent.firstName) && studentBloodStatus.pure.includes(newStudent.firstName)) {
      return `Half blood`;
    } else if (studentBloodStatus.half.includes(newStudent.firstName)) {
      return `Half blood`;
    } else if (studentBloodStatus.pure.includes(newStudent.firstName)) {
      return `Pure blood`;
    } else {
      return `Muggle`;
    }
  }
  return newStudent;
}
