// Raw user data from ProjectWorks
// {
//   user: {
//     UserID: 123,
//     Email: 'john.doe@ackama.com',
//     AlternateEmail: 'john.doe@other.co.nz',
//     FirstName: 'John',
//     LastName: 'Doe',
//     BirthDate: null,
//     Gender: 'Male',
//     JobTitle: 'Developer',
//     EmployeeStartDate: '2022-10-26T00:00:00',
//     EmployeeEndDate: null,
//     IsActive: true,
//     CustomFields: null,
//     ExternalReference: null,
//     ModifiedDateUTC: '2022-11-11T22:23:11.7966667'
//   },
//   days: []
// }
export interface ProjectWorksUser {
  UserID: number;
  FirstName: string;
  LastName: string;
}

// A Leave as it is modeled in this app
export interface Leave {
  user: ProjectWorksUser;
  days: Array<{
    Date: string;
    Hours: number;
  }>;
}

// Example of the JSON payload we get from the ProjectWorks leaves API:
//
// {
//   "LeaveID": 112233,
//   "UserID": 123,
//   "StatusID": 2,
//   "DateSubmitted": "2022-09-08T07:10:50.54",
//   "ModifiedDateUTC": "2022-09-11T22:44:51.32",
//   "RequestComment": "Annual leave",
//   "ResponseComment": "1 Day Annual Leave plus 2 Public Holidays, ",
//   "IsReviewRequired": false,
//   "ExternalReference": null,
//   "IsExported": false,
//   "IsExportUpdateRequired": false,
//   "ExportedBy": null,
//   "ExportedDate": null,
//   "RowVersion": "AAAAAAAW6FM=",
//   "Days": [
//     {
//       "Date": "2022-09-21T00:00:00",
//       "TypeID": 1,
//       "Hours": 7.6,
//       "PayrollExportReference": null
//     }
//   ]
// }
//
export interface ProjectWorksLeave {
  LeaveID: number;
  UserID: number;
  StatusID: number;
  Days: Array<{
    Date: string;
    Hours: number;
  }>;
}

export interface SlackApiBlock {
  type: string;
  text?: object | string;
  elements?: object[];
}

export interface SlackApiPayload {
  blocks: SlackApiBlock[];
}

export interface NotifierResult {
  success: boolean;
  message: string;
}
