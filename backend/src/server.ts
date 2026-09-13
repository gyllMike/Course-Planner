import express from "express";
import { adminAuthLogin, adminAuthLogout, adminAuthRegister, adminStudentUserDetails, adminStudentUserDetailsUpdate, adminStudentUserPasswordUpdate } from "./auth.js";
import createHttpError from "http-errors";
import { findStudentIdFromSession } from "./helper.js";

const app = express();
const PORT = 3000;

app.use(express.json());

const courses = [
    {
        code: "COMP1511",
        name: "Programming Fundamentals",
        uoc: 6
    },
    {
        code: "COMP2521",
        name: "Data Structures and Algorithms",
        uoc: 6
    },
    {
        code: "MATH1081",
        name: "Discrete Mathematics",
        uoc: 6
    }
];

// routes

app.get("/", (req, res) => {
    res.json({
        message: "UNSW Planner API"
    });
});

app.get("/courses", (req, res) => {
    res.json(courses);
});

///////////////////////////////////////////////////////////////////////////////
/**
 * POST /v1/admin/auth/register
 *
 * user input the information and registered
 * 
 * @param {string} email        200.user.email - user put the email
 * @param {string} password     200.user.password - user put the password
 * @param {string} nameFirst    200.user.nameFirst - user put the nameFirst
 * @param {string} nameLast     200.user.nameLast - user put the nameLast
 * @param {string} programName  200.user.programName - user put the programName
 * @param {number} age          200.user.age - user put the age
 * 
 * @returns {Object} 200 - The generated controlUserSessionId
 */
app.post('/v1/admin/auth/register', async (req, res) => {
  const {
    email,
    password,
    nameFirst,
    nameLast,
    programName,
    age,
  } = req.body;

  const result = await adminAuthRegister(
    email,
    password,
    nameFirst,
    nameLast,
    programName,
    age
  );

  res.status(200).json(result);
});


/**
 * POST /v1/admin/auth/login
 *
 * user input the information and login
 * 
 * @param {string} email        200.user.email - user put the email
 * @param {string} password     200.user.password - user put the password
 *
 * @returns {Object} 200 - The generated controlUserSessionId
 */
app.post('/v1/admin/auth/login', async (req, res) => {
    const {
        email,
        password,
    } = req.body;

    const result = await adminAuthLogin(email, password);

    res.status(200).json(result);
});

/**
 * GET /v1/admin/studentuser/details
 * 
 * Retrieve detailed information about a specific student user
 * based on a valid controlUserSessionId.
 * 
 * @param {string} controlUserSessionId - A unique session ID (generated via UUID) that maps to a valid studentId.
 * 
 * @returns {object} 200 - Successful response containing user details
 * @returns {object} 200.user
 * @returns {number} 200.user.studentId - The user's unique ID
 * @returns {string} 200.user.name - Full name (first and last name concatenated with a space)
 * @returns {number} 200.user.age - The age of the user.
 * @returns {string} 200.user.email - The user's registered email address
 * @returns {string} 200.user.programName - The program name that the student user studyed in
 * @returns {number} 200.user.numSuccessfulLogins - Total successful logins since registration
 * @returns {number} 200.user.numFailedPasswordsSinceLastLogin - Number of failed login attempts
 *                                                              since the last successful login
 */
app.get('/v1/admin/studentuser/details', (req, res) => {

  const controlUserSessionId = req.header('controlUserSessionId');

  if (!controlUserSessionId) {
    throw createHttpError(401, 'Missing controlUserSessionid');
  }

  const studentId = findStudentIdFromSession(controlUserSessionId);

  const result = adminStudentUserDetails(studentId);

  res.status(200).json(result);

});

/**
 * PUT /v1/admin/studentuser/details
 * 
 * Retrieve detailed information about a specific student user
 * based on a valid controlUserSessionId 
 * 
 * @param {string} controlUserSessionId - A unique session ID (generated via UUID) that maps to a valid studentId.
 * @param {string} email        200.user.email - user put the email
 * @param {string} password     200.user.password - user put the password
 * @param {string} nameFirst    200.user.nameFirst - user put the nameFirst
 * @param {string} nameLast     200.user.nameLast - user put the nameLast
 * @param {number} age          200.user.age - user put the age
 * @param {string} programName  200.user.programName - user put the programName
 * 
 * @returns {}
 */
app.put('/v1/admin/studentuser/details', (req, res) => {

  const controlUserSessionId = req.header('controlUserSessionId');

  if (!controlUserSessionId) {
    throw createHttpError(401, 'Missing controlUserSessionid');
  }

  const {
    email,
    nameFirst,
    nameLast,
    age, 
    programName,
  } = req.body;

  const studentId = findStudentIdFromSession(controlUserSessionId);

  const result = adminStudentUserDetailsUpdate(studentId, email, nameFirst, nameLast, age, programName);

  res.status(200).json(result);

});

/**
 * PUT /v1/admin/studentuser/details
 * 
 * Retrieve detailed information about a specific student user
 * based on a valid controlUserSessionId 
 * 
 * @param {string} controlUserSessionId - A unique session ID (generated via UUID) that maps to a valid studentId.
 * @param {string} oldPassword 200.user.password - current user password (before change)
 * @param {string} newPassword 200.user.password - new user password (after change)
 * 
 * @returns {} 
 */
app.put('/v1/admin/studentuser/password', async (req, res) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  if (!controlUserSessionId) {
    throw createHttpError(401, 'Missing controlUserSessionid');
  }

  const {
    oldPassword,
    newPassword,
  } = req.body;

  const studentId = findStudentIdFromSession(controlUserSessionId);
  const result = await adminStudentUserPasswordUpdate(studentId, oldPassword, newPassword);

  res.status(200).json(result);
});

/**
 * POST /v1/admin/auth/logout
 * 
 * Logs out an authenticated student user by invalidating the provided session ID.
 * 
 * @param {string} controlUserSessionId - A unique session ID (generated via UUID) that maps to a valid studentId.
 * 
 * @returns {}
 */
app.post('/v1/admin/auth/logout', (req, res) => {
  const controlUserSessionId = req.header('controlUserSessionId');
  if (!controlUserSessionId) {
    throw createHttpError(401, 'Missing controlUserSessionid');
  }
  const result = adminAuthLogout(controlUserSessionId);
  res.status(200).json(result);
});

///////////////////////////////////////////////////////////////////////////////
// dealing none route
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// wrong middlelware
app.use((
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.status(err.status ?? 500).json({
    error: err.message ?? 'Internal server error',
  });
});

// open server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});