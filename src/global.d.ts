type Term = {
    termID?: number;
    termName: string;
    startDate: string;
    endDate: string;
    isAvailable: boolean;
    defaultDeadline: string;
}


interface Course {
    [key: string]: any;
    courseID: number;
    courseNum: string;
    termName: string;
    termID: number;
    courseName: string;
    totalAvailableHours: number;
    currentAvailableHours: number;
    estimatedNumOfStudents: number;
    currentlyNumOfStudents: number;
    needTutors: boolean;
    needMarkers: boolean;
    numOfAssignments: number;
    numOfLabsPerWeek: number;
    numOfTutorialsPerWeek: number;
    tutorResponsibility: string;
    markerResponsibility: string;
    canPreAssign: boolean;
    markerDeadLine: string;
    tutorDeadLine: string;
    prerequisite: string;

}


type courseFormType = {
    needTutors: boolean;
    estimatedNumOfStudents: string | number;
    numOfTutorialsPerWeek: string | number;
    canPreAssign: boolean;
    termID: number;
    numOfAssignments: string | number;
    courseNum: string;
    markerResponsibility: string;
    courseName: string;
    tutorResponsibility: string;
    numOfLabsPerWeek: string | number;
    totalAvailableHours: string | number;
    needMarkers: boolean;
    currentlyNumOfStudents: string | number;
    markerDeadLine: string;
    tutorDeadLine: string;
}


type applicationApprovalList = {
    applicationID: number;
    submittedDate: string;
    createdDateTime: string;
    term: string;
    termID: number;
    status: string;
    email: string;
    name: string;
    upi: string;
    auid: string;
    currentlyOverseas: boolean;
    willBackToNZ: boolean;
    isCitizenOrPR: boolean;
    haveValidVisa: boolean;
    enrolDetails: string;
    studentDegree: string;
    haveOtherContracts: boolean;
    otherContracts: string;
    maximumWorkingHours: string;
    savedTime: string;
    PreferCourse: Array<any>;
    userID: string;
    PreferCourseGPA: number;
}