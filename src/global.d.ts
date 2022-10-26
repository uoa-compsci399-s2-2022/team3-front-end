

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
    courseName?: string;
    totalAvailableHours?: number;
    currentAvailableHours?: number;
    currentPublishedAvailableHours?: number;
    estimatedNumOfStudents?: number;
    currentlyNumOfStudents?: number;
    needTutors?: boolean;
    needMarkers?: boolean;
    numOfAssignments?: number;
    numOfLabsPerWeek?: number;
    numOfTutorialsPerWeek?: number;
    tutorResponsibility?: string;
    markerResponsibility?: string;
    canPreAssign?: boolean;
    markerDeadLine?: string;
    tutorDeadLine?: string;
    prerequisite?: string;
    courseCoordinators?: Array<any>;
}


type courseFormType = {
    needTutors: boolean;
    estimatedNumOfStudents: null | number;
    numOfTutorialsPerWeek: null | number;
    canPreAssign: boolean;
    termID: number;
    numOfAssignments: null | number;
    courseNum: string;
    markerResponsibility: string;
    courseName: string;
    tutorResponsibility: string;
    numOfLabsPerWeek: null | number;
    totalAvailableHours: null | number;
    needMarkers: boolean;
    currentlyNumOfStudents: null | number;
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
    EnrolledCourse: Array<any>;
}


type EChartsOption = echarts.EChartsOption


