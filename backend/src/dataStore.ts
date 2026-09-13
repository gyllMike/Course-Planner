import fs from 'fs';

export interface Student {

    studentId: number;
    age: number;
    programName: string;  
}

export interface StudentAuth {
    studentId: number;

    school: string;
    nameFirst: string;
    nameLast: string;
    email: string;

    oldPasswordHashes: string[];
    passwordHash: string;

    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
}

// controlUserSessionId aim to gain the web string id
// studentId is the id of student
export interface Session {
    controlUserSessionId: string;
    studentId: number;
}

export interface DataStore {
    studentArray: {student: Student}[];
    StudentAuthArray: {studentAuth: StudentAuth}[];
    controlUserSessionsArray: {controlUserSession: Session }[];
}

// data build

let data: DataStore = {
    studentArray: [],
    controlUserSessionsArray: [],
    StudentAuthArray: []
}

const databaseFileName = 'database.json';

const save = () => {
  // format change
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(databaseFileName, jsonString);
};

const load = () => {
  if (!fs.existsSync(databaseFileName)) {
    return;
  }

  const jsonString = fs.readFileSync(
    databaseFileName,
    'utf-8'
  );

  data = JSON.parse(jsonString);
};

// Use get() to access the data
function getData(): DataStore {
  load();
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore): void {
  data = newData;
  save();
}

export { getData, setData };