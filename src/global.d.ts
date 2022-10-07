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
    deadLine: string;
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
    deadLine: string
}