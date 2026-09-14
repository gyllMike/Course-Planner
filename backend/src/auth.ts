import { getData, setData } from './dataStore.js';
import type { Session, DataStore } from './dataStore.js';
import {
        studentIdGen,
        controlUserSessionIdGen,
        nameValidity,
        schoolValidity,
        eamilValidity,
        passwordValidity,
        programNameValidity,
        ageValidity
} from './helper.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

/**
  * Registers a new mission control user and creates an authenticated user session.
  *
  * @param email - The email address that the controlUser uses to register
  * @param password - The password that the controlUser sets to register and later logins
  * @param nameFirst - The first name of the controlUser
  * @param nameLast - The last name of the controlUser
  * @param school - The school of the controlUser
  *
  * @returns An object containing the generated controlUserSessionId if the controlUser is successfully registered.
  * @throws {HTTPError} 400 - Error case: if the email, name or password is invalid.
*/
export async function adminAuthRegister(
        email: string, 
        password: string, 
        nameFirst: string, 
        nameLast: string, 
        programName: string, 
        age: number,
        school: string): Promise<{ controlUserSessionId: string }> {
    
    if (eamilValidity(email) !== null) {
        throw createHttpError(400, 'Invalid email');
    }

    if (nameValidity(nameFirst, nameLast) !== true) {
        throw createHttpError(400, 'Name Invalid');
    }

    if (passwordValidity(password) !== true) {
        throw createHttpError(400, 'PassWoed Invalid');
    }

    if (programNameValidity(programName) !== true) {
        throw createHttpError(400, 'PassWoed Invalid');
    }

    if (ageValidity(age) !== true) {
        throw createHttpError(400, 'PassWoed Invalid');
    }

    if (schoolValidity(school) !== true) {
        throw createHttpError(400, 'Invalid school');
    }

    const data: DataStore = getData();
    const studentId: number = studentIdGen();
    const studentSessionId: string = controlUserSessionIdGen();
    const hashedPassword = await bcrypt.hash(password, 10);

    data.StudentAuthArray.push({
        studentAuth: {
            studentId: studentId,
            school: school,
            nameFirst: nameFirst,
            nameLast: nameLast,
            email: email,
            oldPasswordHashes: [],
            passwordHash: hashedPassword,
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0
        }
    });

    data.controlUserSessionsArray.push({
        controlUserSession: {
            controlUserSessionId: studentSessionId,
            studentId: studentId
        }
    });

    data.studentArray.push({
        student: {
            studentId: studentId,
            age: age,
            programName: programName
        }
    });

    setData(data);

    return { controlUserSessionId: studentSessionId};
}

/**
 * Logs in an existing mission control user and creates an authenticated user session.
 *
 * @param email - The email address that the controlUser uses to log in
 * @param password - The password that the controlUser uses to log in
 * 
 * @returns An object containing the generated controlUserSessionId if the controlUser is successfully logged in.
 * @throws {HTTPError} 400 - Error case: if no user is found, the email does not exist, or the password is incorrect.
 */
export async function adminAuthLogin(email: string, password: string): Promise<{ controlUserSessionId: string }> {

    const data = getData();

    if (!data.StudentAuthArray || data.StudentAuthArray.length === 0) {
        throw createHttpError(400, 'No user found');
    }

    const userObject = data.StudentAuthArray.find(f => f.studentAuth.email === email);
    if (!userObject) {
        throw createHttpError(400, 'Incorrect email or password');
    }
    const user = userObject.studentAuth;

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        user.numFailedPasswordsSinceLastLogin++;
        setData(data);
        throw createHttpError(400, 'Incorrect email or password');
    }

    user.numSuccessfulLogins++;
    user.numFailedPasswordsSinceLastLogin = 0;
    const controlUserSessionId =
    controlUserSessionIdGen();

    const newSession: Session = {
        controlUserSessionId,
        studentId: user.studentId,
    };

    data.controlUserSessionsArray.push({
        controlUserSession: newSession,
    });

    setData(data);

    return { controlUserSessionId };
}

/**
 * returns the full details of a student (control user)
 * 
 * @param studentId - the unique identifier of the student (control user)
 * 
 * @returns An object containing the student's id, name, email, program name, successful login count and failed password count.
 * @throws {HTTPError} 401 - Error case: if the studentId is invalid.
 */
export function adminStudentUserDetails(studentId: number): {user: 
    {
        studentId: number;
        name: string;
        school: string;
        age: number;
        email: string;
        programName: string;
        numSuccessfulLogins: number;
        numFailedPasswordsSinceLastLogin: number;
    }
} {

    const data = getData();
    const userObject = data.StudentAuthArray.find(f => f.studentAuth.studentId === studentId);
    if (!userObject) {
        throw createHttpError(401, 'Invalid studentId');
    }
    const userAuth = userObject.studentAuth;

    const studentSpecificDetail = data.studentArray.find(f => f.student.studentId === studentId);
    if (!studentSpecificDetail) {
        throw createHttpError(401, 'Invalid studentId');
    }
    const program = studentSpecificDetail.student.programName;
    const age = studentSpecificDetail.student.age;

    return {
        user:
        {
            studentId: userAuth.studentId,
            name:`${userAuth.nameFirst} ${userAuth.nameLast}`,
            age: age,
            school: userAuth.school,
            email: userAuth.email,
            programName: program,
            numSuccessfulLogins: userAuth.numSuccessfulLogins,
            numFailedPasswordsSinceLastLogin: userAuth.numFailedPasswordsSinceLastLogin,
        },
    };
}

/**
 * Updates the email and name details of an existing mission control user.
 *
 * @param studentId - The unique identifier of the student
 * @param email - The new email address for the student
 * @param nameFirst - The new first name of the student
 * @param nameLast - The new last name of the student
 * @param programName - The program that the student is taking
 * @param age - The age of the user
 * @param school - The school of the user
 *
 * @returns An empty object if the controlUser details are successfully updated.
 *
 * @throws {HTTPError} 400 - If the email, name, age, or programName is invalid.
 * @throws {HTTPError} 401 - If the studentId/controlUserId is invalid.
 */
export function adminStudentUserDetailsUpdate(studentId: number, 
    email: string, 
    nameFirst: string, 
    nameLast: string, 
    age: number, 
    programName: string, 
    school: string 
): Record<string, never> {

    const data = getData();

    const student = data.studentArray.find(f => f.student.studentId === studentId);
    const stuDetail = data.StudentAuthArray.find(f => f.studentAuth.studentId === studentId);

    if (!student || !stuDetail) {
        throw createHttpError(401, 'Invalid studentId');
    }

    const emailError = eamilValidity(email, studentId);

    if (emailError === 'Wrong format') {
        throw createHttpError(400, 'Invalid email');
    } else if (emailError === 'Email in use') {
        throw createHttpError(400, 'Email is currently used by another user');
    }

    if (!nameValidity(nameFirst, nameLast)) {
        throw createHttpError(400, 'NameFirst or NameLast is invalid');
    }

    if (!programNameValidity(programName)) {
        throw createHttpError(400, 'Invalid programName');
    }

    if (!ageValidity(age)) {
        throw createHttpError(400, 'Invalid age');
    }

    if (!schoolValidity(school)) {
        throw createHttpError(400, 'Invalid school');
    }

    stuDetail.studentAuth.school = school;
    student.student.programName = programName;
    student.student.age = age;
    stuDetail.studentAuth.email = email;
    stuDetail.studentAuth.nameFirst = nameFirst;
    stuDetail.studentAuth.nameLast = nameLast;
    
    setData(data);

    return {};
}

/**
 * Updates the password of an existing student user.
 *
 * @param studentId - The unique identifier of the student
 * @param oldPassword - The current password of the student user
 * @param newPassword - The new password to be set for the student user
 *
 * @returns An empty object if the student user password is successfully updated.
 *
 * @throws {HTTPError} 400 - If the old password is incorrect, the new password is invalid,
 * matches the old password, or has already been used.
 *
 * @throws {HTTPError} 401 - If the studentId is invalid.
 */
export async function adminStudentUserPasswordUpdate(studentId: number, oldPassword: string, newPassword: string): Promise<Record<string, never>> {

    const data = getData();

    const student = data.StudentAuthArray.find(f => f.studentAuth.studentId === studentId);
    if (!student) {
        throw createHttpError(401, 'Invalid studentId');
    }

    if (oldPassword === newPassword) {
        throw createHttpError(400, 'Old Password and New Password match exactly.');
    } 

    if (passwordValidity(newPassword) === false) {
        throw createHttpError(400, 'New Password is not valid.');
    }

    const oldPasswordArray = student.studentAuth.oldPasswordHashes;
    const oldHashPassword = await bcrypt.compare(oldPassword, student.studentAuth.passwordHash);
    if (!oldHashPassword) {
        throw createHttpError(400, 'Old Password is not the correct old password.');
    }

    const passwordHashes = [
        student.studentAuth.passwordHash,
        ...oldPasswordArray,
    ]; 
    
    const comparisons = await Promise.all(passwordHashes.map(hash => bcrypt.compare(newPassword, hash)));

    if (comparisons.some(matches => matches)) {
        throw createHttpError(400, 'New Password has already been used before.');
    }

    const newHashPassword = await bcrypt.hash(newPassword, 10);

    oldPasswordArray.push(student.studentAuth.passwordHash);

    student.studentAuth.passwordHash = newHashPassword;

    setData(data);

    return {};
}

/**
 * Logs out an authenticated student user session.
 *
 * @param controlUserSessionId - The session ID of the controlUser(student) to log out
 *
 * @returns An empty object if the controlUser(student) is successfully logged out.
 *
 * @throws {HTTPError} 401 - If the controlUserSessionId is invalid.
 */
export function adminAuthLogout(controlUserSessionId: string): Record<string, never> {
    const data = getData();
    const findIdx = data.controlUserSessionsArray.findIndex(i => i.controlUserSession.controlUserSessionId === controlUserSessionId);
    if (findIdx === -1) {
        throw createHttpError(401, 'Invalid session');
    }
    data.controlUserSessionsArray.splice(findIdx, 1);
    setData(data);
    return {};
}