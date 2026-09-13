import { adminAuthLogin, adminAuthLogout, adminAuthRegister, adminStudentUserDetails, adminStudentUserDetailsUpdate, adminStudentUserPasswordUpdate } from "../src/auth.js";
import { setData } from '../src/dataStore.js';
import {
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { requestAdminAuthLogin, 
    requestAdminAuthRegister, 
    requestAdminStudentUserDetails, 
    requestAdminStudentDetailsUpdate, 
    requestAdminStudentUserPasswordUpdate, 
    requestAdminAuthLogout 
} from "../src/requestHelpers.js";
import {findStudentIdFromSession} from "../src/helper.js";

beforeEach(() => {
  setData({
    studentArray: [],
    StudentAuthArray: [],
    controlUserSessionsArray: [],
  });
});

// Test function adminAuthRegister
describe('adminAuthRegister tests', () => {

    test('register successfully', async () => {
        const registerReturn = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        expect(registerReturn).toEqual({
            controlUserSessionId: expect.any(String)
        });
    });

    test('register unsuccessfully: invalid email', async () => {
        await expect(
            adminAuthRegister(
            'invalid-email',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: duplicate email', async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'def456~!@',
            'Peter',
            'Smith',
            'Engineering',
            21
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid password', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            '123',
            'Alan',
            'Guo',
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid name first', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'a'.repeat(1000),
            'Guo',
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid name last', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'a'.repeat(1000),
            'Computer Science',
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid program name', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'a'.repeat(1000),
            20
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

    test('register unsuccessfully: invalid program age', async () => {
        await expect(
            adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            -1
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

});

describe('POST /v1/admin/auth/register - HTTP layer via requestHelper', () => {

    test('returns 200 for valid registration', async () => {
          const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('controlUserSessionId');
        expect(typeof response.body.controlUserSessionId).toBe('string');
    });
    

    test('returns 400 for invalid registration: email case', async () => {
        const response = await requestAdminAuthRegister(
            'invalid-email',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: duplicate email case', async () => {
        await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'def456~!@',
            'Peter',
            'Smith',
            'Engineering',
            21
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: password case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'a'.repeat(100),
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: nameFirst case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'a'.repeat(100),
            'Guo',
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid registration: nameLast case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'G'.repeat(100),
            'Computer Science',
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid registration: programName case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'C'.repeat(100),
            20
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid registration: age case', async () => {
        const response = await requestAdminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            -1
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

});

// Test function adminAuthLogin
describe('adminAuthLogin tests', () => {

    beforeEach(async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
    });

    test('Login successfully', async () => {

        const LoginReturn = await adminAuthLogin(
            'z5678705@unsw.edu.au',
            'abc123~!@'
        );

        expect(LoginReturn).toEqual({
            controlUserSessionId: expect.any(String)
        });

    });

    test('Login unsuccessfully: email case', async () => {
        await expect(
            adminAuthLogin(
                'z5555555@unsw.edu.au',
                'abc123~!@'
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });


    test('Login unseccessfully: password case', async () => {
        await expect(
            adminAuthLogin(
                'z5678705@unsw.edu.au',
                '123'
            )
        ).rejects.toMatchObject({
            status: 400,
        });
    });

});

describe('POST /v1/admin/auth/login - HTTP layer via requestHelper', () => {

    beforeEach(async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
    });

    test('returns 200 for valid login', async () => {
        const response = await requestAdminAuthLogin(
            'z5678705@unsw.edu.au',
            'abc123~!@'
        );
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('controlUserSessionId');
        expect(typeof response.body.controlUserSessionId).toBe('string');
    });

    test('returns 400 for invalid login: email case', async () => {
        const response = await requestAdminAuthLogin(
            'invalid-email',
            'abc123~!@'
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid login: password case', async () => {
        const response = await requestAdminAuthLogin(
            'z5678705@unsw.edu.au',
            'wrongPassword123'
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

});

// Test function adminStudentUserDetails
describe('adminStudentUserDetails tests', () => {

    let studentId: number;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        studentId = findStudentIdFromSession(register.controlUserSessionId);
    });

    test('Correct Student Details', () => {

        const student = adminStudentUserDetails(studentId);

        expect(student).toEqual({
        user: {
            studentId,
            name: 'Alan Guo',
            age: 20,
            email: 'z5678705@unsw.edu.au',
            programName: 'Computer Science',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
        },
        });
    });

    test('throws for invalid studentId', () => {
        expect(() => adminStudentUserDetails(-1)).toThrow('Invalid studentId');
    });

});

describe('GET /v1/admin/studentuser/details - HTTP layer via requestHelper', () => {

    let controlUserSessionId: string;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        controlUserSessionId = register.controlUserSessionId;
    });

    test('returns 200 for valid details', async () => {
        const response = await requestAdminStudentUserDetails(controlUserSessionId);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
        user: {
            studentId: expect.any(Number),
            name: 'Alan Guo',
            age: 20,
            email: 'z5678705@unsw.edu.au',
            programName: 'Computer Science',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
        },
        });
    });

    test('returns 401 for invalid controlUserSessionId', async () => {
        const response = await requestAdminStudentUserDetails('-1');
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

});

// Test function adminStudentUserDetailsUpdate
describe('adminStudentUserDetailsUpdate tests', () => {

    let studentId: number;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        studentId = findStudentIdFromSession(register.controlUserSessionId);
    });


    test('Details Update Successful', () => {

        const res1 = adminStudentUserDetailsUpdate(studentId, 'z5567980@unsw.edu.au', 'Chris', 'Li', 21, 'Electrical Eng');

        const res2 = adminStudentUserDetails(studentId);

        expect(res2).toMatchObject({
            user: {
                studentId,
                name: 'Chris Li',
                age: 21,
                email: 'z5567980@unsw.edu.au',
                programName: 'Electrical Eng',
                numSuccessfulLogins: expect.any(Number),
                numFailedPasswordsSinceLastLogin: expect.any(Number),
            },
        });
    });

    test('Details Update Unsuccessful: Invalid studentId', () => {
        expect(() => adminStudentUserDetailsUpdate(-1, '123', 'Chris', 'Li', 21, 'Electrical Eng')).toThrow('Invalid studentId');
    });

    test('Details Update Unsuccessful: Invalid Email fromat', () => {
        expect(() => adminStudentUserDetailsUpdate(studentId, '123', 'Chris', 'Li', 21, 'Electrical Eng')).toThrow('Invalid email');
    });

    test('Details Update Unsuccessful: Email in use', async () => {
        let stu1Id: number;
        const register = await adminAuthRegister(
            'z5678706@unsw.edu.au',
            'abc123~!@',
            'Jack',
            'Cheng',
            'Computer Science',
            20
        );
        stu1Id = findStudentIdFromSession(register.controlUserSessionId);
        expect(() => adminStudentUserDetailsUpdate(stu1Id, 'z5678705@unsw.edu.au', 'Mike', 'Cheng', 21, 'Computer Science')).toThrow('Email is currently used by another user');
    });

    test('Details Update Unsuccessful: FirstName invalidity', () => {
        expect(() => adminStudentUserDetailsUpdate(studentId, 'z5567980@unsw.edu.au', 'a'.repeat(100), 'Guo', 21, 'Electrical Eng')).toThrow('NameFirst or NameLast is invalid');
    });

    test('Details Update Unsuccessful: LastName invalidity', () => {
        expect(() => adminStudentUserDetailsUpdate(studentId, 'z5567980@unsw.edu.au', 'Jack', 'G'.repeat(100), 21, 'Electrical Eng')).toThrow('NameFirst or NameLast is invalid');
    });

    test('Details Update Unsuccessful: ProgramName invalidity', () => {
        expect(() => adminStudentUserDetailsUpdate(studentId, 'z5567980@unsw.edu.au', 'Jack', 'Guo', 21, 'E'.repeat(100))).toThrow('Invalid programName');
    });

    test('Details Update Unsuccessful: age invalidity', () => {
        expect(() => adminStudentUserDetailsUpdate(studentId, 'z5567980@unsw.edu.au', 'Jack', 'Guo', -1, 'Electrical Eng')).toThrow('Invalid age');
    });
});

describe('PUT /v1/admin/studentuser/details - HTTP layer via requestHelper', () => {

    let controlUserSessionId: string;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        controlUserSessionId = register.controlUserSessionId;
    });

    test('returns 200 for updating successful', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            controlUserSessionId,
            'z55555@unsw.edu.au',
            'Eric',
            'Wang',
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({});
        const detailsResponse = await requestAdminStudentUserDetails(controlUserSessionId);
        expect(detailsResponse.statusCode).toBe(200);
        expect(detailsResponse.body).toMatchObject({
            user: {
                name: 'Eric Wang',
                email: 'z55555@unsw.edu.au',
                age: 21,
                programName: 'Electrical Eng',
            },
        });
    });

    test('returns 401 for invalid controlUserSessionId', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            '-1',
            'z55555@unsw.edu.au',
            'Eric',
            'Wang',
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 401 for missing controlUserSessionId', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            '',
            'z55555@unsw.edu.au',
            'Eric',
            'Wang',
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid email', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            controlUserSessionId,
            'z55555',
            'Eric',
            'Wang',
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for Email in use', async () => {

        let sessionId: string;

        const register = await adminAuthRegister(
            'z5678706@unsw.edu.au',
            'abc123~!@',
            'Eric',
            'Yi',
            'Computer Science',
            20
        );
        sessionId = register.controlUserSessionId

        const response = await requestAdminStudentDetailsUpdate(
            sessionId,
            'z5678705@unsw.edu.au',
            'Eric',
            'Wang',
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    
    test('returns 400 for invalid nameFirst', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            controlUserSessionId,
            'z55555@unsw.edu.au',
            'E'.repeat(100),
            'Wang',
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });


    test('returns 400 for invalid nameLast', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            controlUserSessionId,
            'z55555@unsw.edu.au',
            'Wang',
            'E'.repeat(100),
            21,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid age', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            controlUserSessionId,
            'z55555@unsw.edu.au',
            'Wang',
            'Eric',
            -1,
            'Electrical Eng'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid programName', async () => {
        const response = await requestAdminStudentDetailsUpdate(
            controlUserSessionId,
            'z55555@unsw.edu.au',
            'Wang',
            'Eric',
            20,
            'E'.repeat(100)
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });
});

// test function adminStudentUserPasswordUpdate
describe('adminStudentUserPasswordUpdate tests', () => {

    let studentId: number;
    
    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        studentId = findStudentIdFromSession(register.controlUserSessionId);
    });

    test('Password Update Successful', async () => {
        const res1 = await adminStudentUserPasswordUpdate(studentId, 'abc123~!@', 'cba123~@');
        const loginReturn = await adminAuthLogin('z5678705@unsw.edu.au', 'cba123~@');
        expect(res1).toEqual({});
        expect(loginReturn).toEqual({controlUserSessionId: expect.any(String)});
    });

    test('Password Update Unsuccessful: Invalid studentId', async () => {
        await expect(
            adminStudentUserPasswordUpdate(-1, 'abc123~!@', 'cba123~@')
        ).rejects.toThrow('Invalid studentId');
    })

    test('Password Update Unsuccessful: invalid old password', async () => {
        await expect(
            adminStudentUserPasswordUpdate(
                studentId, 'abc124~!@', 'cba123~@'
            )
        ).rejects.toThrow('Old Password is not the correct old password.');
    });

    test('Password Update Unsuccessful: Old Password and New Password match exactly', async () => {
        await expect(
            adminStudentUserPasswordUpdate(
                studentId, 'abc123~!@', 'abc123~!@'
            )
        ).rejects.toThrow('Old Password and New Password match exactly.');
    });

    test('Password Update Unsuccessful: New Password is not valid', async () => {
        await expect(
            adminStudentUserPasswordUpdate(
                studentId, 'abc123~!@', 'a'.repeat(100)
            )
        ).rejects.toThrow('New Password is not valid.');
    });

    test('Password Update Unsuccessful: New Password has already been used before', async () => {

        await adminStudentUserPasswordUpdate(
            studentId,
            'abc123~!@',
            'newPassword123!'
        );

        await adminStudentUserPasswordUpdate(
            studentId,
            'newPassword123!',
            'anotherPassword456!'
        );

        await expect(
            adminStudentUserPasswordUpdate(
                studentId,
                'anotherPassword456!',
                'abc123~!@'
            )
        ).rejects.toThrow('New Password has already been used before.');
    });
});

describe('PUT /v1/admin/studentuser/password - HTTP layer via requestHelper', () => {

    let controlUserSessionId: string;

    beforeEach(async () => {
        const register = await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );

        controlUserSessionId = register.controlUserSessionId;
    });

    test('returns 200 for updating successful', async () => {
        const response = await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId,
            'abc123~!@',
            'cba123~!@'
        );

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({});
        const detailsResponse = await requestAdminStudentUserDetails(controlUserSessionId);
        expect(detailsResponse.statusCode).toBe(200);
    });

    test('returns 401 for inValid controlUserSessionId', async () => {
        const response = await requestAdminStudentUserPasswordUpdate(
            '-1',
            'abc123~!@',
            'cba123~!@'
        );
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for invalid old password', async () => {
        const response = await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId, 
            'abc124~!@', 
            'cba123~!@'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for Old Password and New Password match exactly', async () => {
        const response = await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId, 
            'abc123~!@', 
            'abc123~!@'
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for New Password is not valid', async () => {
        const response = await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId, 
            'abc123~!@', 
            'a'.repeat(100)
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

    test('returns 400 for New Password has already been used before', async () => {
        await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId, 
            'abc123~!@', 
            'newPassword123!'
        );

        await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId, 
            'newPassword123!', 
            'newPassword456!'
        );

        const response = await requestAdminStudentUserPasswordUpdate(
            controlUserSessionId, 
            'newPassword456!', 
            'newPassword123!'
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });

});

// test function adminAuthLogout
describe('adminAuthLogout tests', () => {
    let stulogin: string;
    
    beforeEach(async () => {

        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        const loginreturn = await adminAuthLogin('z5678705@unsw.edu.au', 'abc123~!@');
        stulogin = loginreturn.controlUserSessionId;
    });

    test('Logout Successful', () => {
        const stulogout = adminAuthLogout(stulogin)
        expect(stulogout).toEqual({});
        expect(() => findStudentIdFromSession(stulogin)).toThrow();
    });

    test('Logout unsuccessful: invalid sessionid', () => {
        expect(() => adminAuthLogout('-1')).toThrow('Invalid session');
    });
});

describe('POST /v1/admin/auth/logout - HTTP layer via requestHelper', () => {
    let controlUserSessionId: string;

    beforeEach(async () => {
        await adminAuthRegister(
            'z5678705@unsw.edu.au',
            'abc123~!@',
            'Alan',
            'Guo',
            'Computer Science',
            20
        );
        const register = await adminAuthLogin('z5678705@unsw.edu.au', 'abc123~!@')
        controlUserSessionId = register.controlUserSessionId;
    });

    test('returns 200 for logout successful', async () => {
        const response = await requestAdminAuthLogout(controlUserSessionId);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({});
        const detailsResponse = await requestAdminStudentUserDetails(controlUserSessionId);
        expect(detailsResponse.statusCode).toBe(401);
    });

    test('returns 401 for invalid sessionid', async () => {
        const response = await requestAdminAuthLogout('-1');
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', expect.any(String));
    });
});