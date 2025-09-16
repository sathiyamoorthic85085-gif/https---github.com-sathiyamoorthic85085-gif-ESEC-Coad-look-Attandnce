
import type { User, AttendanceRecord, Timetable, Department, Class } from './types';

export const mockUsers: User[] = [
    // Students from image
    { id: 'STU001', name: 'ABHI RUBEN S', email: 'abhiruben2402@gmail.com', password: 'ES24EI01', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU001/100/100', classId: 'CLS01', rollNumber: 'ES24EI01', registerNumber: '2403730410721001', mobileNumber: '7708914279' },
    { id: 'STU002', name: 'ABINAYASRI V', email: 'abinayasree0207@gmail.com', password: 'ES24EI02', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU002/100/100', classId: 'CLS01', rollNumber: 'ES24EI02', registerNumber: '2403730410722002', mobileNumber: '9566519970' },
    { id: 'STU003', name: 'BANNARI SANKAR M', email: 'bannarisankar7@gmail.com', password: 'ES24EI03', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU003/100/100', classId: 'CLS01', rollNumber: 'ES24EI03', registerNumber: '2403730410721003', mobileNumber: '6379622003' },
    { id: 'STU004', name: 'CIBIVARSHAN K', email: 'cibibharani@gmail.com', password: 'ES24EI04', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU004/100/100', classId: 'CLS01', rollNumber: 'ES24EI04', registerNumber: '2403730410721004', mobileNumber: '9750356006' },
    { id: 'STU005', name: 'DAYALAN S', email: 'knassvd@gmail.com', password: 'ES24EI05', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU005/100/100', classId: 'CLS01', rollNumber: 'ES24EI05', registerNumber: '2403730410721005', mobileNumber: '9123571328' },
    { id: 'STU006', name: 'DHANUSH V', email: 'romandhanush79@gmail.com', password: 'ES24EI06', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU006/100/100', classId: 'CLS01', rollNumber: 'ES24EI06', registerNumber: '2403730410721006', mobileNumber: '7812860622' },
    { id: 'STU007', name: 'DHARUNSANJAY K', email: 'dharunsanjay681@gmail.com', password: 'ES24EI07', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU007/100/100', classId: 'CLS01', rollNumber: 'ES24EI07', registerNumber: '2403730410721007', mobileNumber: '8637615664' },
    { id: 'STU008', name: 'DINESHKUMAR B', email: 'dineshmsd2007@gmail.com', password: 'ES24EI08', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU008/100/100', classId: 'CLS01', rollNumber: 'ES24EI08', registerNumber: '2403730410721008', mobileNumber: '7358011016' },
    { id: 'STU009', name: 'GLORY CAMRYN JULIYA S', email: 'nithya9944426857@gamil.com', password: 'ES24EI09', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU009/100/100', classId: 'CLS01', rollNumber: 'ES24EI09', registerNumber: '2403730410722009', mobileNumber: '9384426857' },
    { id: 'STU010', name: 'GOWTHAM T', email: 'gowthamt6977@gmail.com', password: 'ES24EI10', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU010/100/100', classId: 'CLS01', rollNumber: 'ES24EI10', registerNumber: '2403730410721010', mobileNumber: '9342066977' },
    { id: 'STU011', name: 'HARISH M', email: 'harishm200602@gmail.com', password: 'ES24EI11', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU011/100/100', classId: 'CLS01', rollNumber: 'ES24EI11', registerNumber: '2403730410721011', mobileNumber: '6369426917' },
    { id: 'STU012', name: 'HARISHKUMAR M', email: 'hk6116523@gmail.com', password: 'ES24EI12', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU012/100/100', classId: 'CLS01', rollNumber: 'ES24EI12', registerNumber: '2403730410721012', mobileNumber: '9442667764' },
    { id: 'STU013', name: 'JAGAPREETHI M', email: 'jagapreethim8@gmail.com', password: 'ES24EI13', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU013/100/100', classId: 'CLS01', rollNumber: 'ES24EI13', registerNumber: '2403730410722013', mobileNumber: '7305037815' },
    { id: 'STU014', name: 'JERIN. A', email: 'j2072443@gmail.com', password: 'ES24EI14', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU014/100/100', classId: 'CLS01', rollNumber: 'ES24EI14', registerNumber: '2403730410721014', mobileNumber: '8056548319' },
    { id: 'STU015', name: 'LOGANATHAN S', email: 'logusenthil18@gmail.com', password: 'ES24EI15', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU015/100/100', classId: 'CLS01', rollNumber: 'ES24EI15', registerNumber: '2403730410721015', mobileNumber: '8838894879' },
    { id: 'STU016', name: 'MADHU MITHRA M', email: 'madhumithra304@outlook.com', password: 'ES24EI16', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU016/100/100', classId: 'CLS01', rollNumber: 'ES24EI16', registerNumber: '2403730410722016', mobileNumber: '9566362252' },
    { id: 'STU017', name: 'MOHANRAJ K', email: 'drmohanraj0@gmail.com', password: 'ES24EI17', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU017/100/100', classId: 'CLS01', rollNumber: 'ES24EI17', registerNumber: '2403730410721017', mobileNumber: '9342652452' },
    { id: 'STU018', name: 'MURALIDHARAN K', email: 'murali05092006@gmail.com', password: 'ES24EI18', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU018/100/100', classId: 'CLS01', rollNumber: 'ES24EI18', registerNumber: '2403730410721018', mobileNumber: '8778249197' },
    { id: 'STU019', name: 'NETHAJI M', email: 'nethajimurugan703@gmail.com', password: 'ES24EI19', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU019/100/100', classId: 'CLS01', rollNumber: 'ES24EI19', registerNumber: '2403730410721019', mobileNumber: '6381090604' },
    { id: 'STU020', name: 'PRAVIN SHARMA P', email: 'sharmapravin232323@gmail.com', password: 'ES24EI20', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU020/100/100', classId: 'CLS01', rollNumber: 'ES24EI20', registerNumber: '2403730410721020', mobileNumber: '9342610150' },
    { id: 'STU021', name: 'PREM KUMAR M', email: 'prem16072007@gmail.com', password: 'ES24EI21', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU021/100/100', classId: 'CLS01', rollNumber: 'ES24EI21', registerNumber: '2403730410721021', mobileNumber: '9363668590' },
    { id: 'STU022', name: 'RAMPRASATH S', email: 'rp476260@gmail.com', password: 'ES24EI22', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU022/100/100', classId: 'CLS01', rollNumber: 'ES24EI22', registerNumber: '2403730410721022', mobileNumber: '9047230413' },
    { id: 'STU023', name: 'RITHIK ROSAN A', email: 'rithik642007@gmail.com', password: 'ES24EI23', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU023/100/100', classId: 'CLS01', rollNumber: 'ES24EI23', registerNumber: '2403730410721023', mobileNumber: '9965738285' },
    { id: 'STU024', name: 'SAHAYA STEEV M', email: 'sahayasteev.m@', password: 'ES24EI24', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU024/100/100', classId: 'CLS01', rollNumber: 'ES24EI24', registerNumber: '2403730410721024', mobileNumber: '9080179229' },
    { id: 'STU025', name: 'SANTHOSH J', email: 'santhoshsatheesh2007@gmail.com', password: 'ES24EI25', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU025/100/100', classId: 'CLS01', rollNumber: 'ES24EI25', registerNumber: '2403730410721025', mobileNumber: '6382961730' },
    { id: 'STU026', name: 'SASIKUMAR S', email: 'sivasasi4171@gmail.com', password: 'ES24EI26', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU026/100/100', classId: 'CLS01', rollNumber: 'ES24EI26', registerNumber: '2403730410721026', mobileNumber: '7339384171' },
    { id: 'STU027', name: 'SATHIYAMOORTHI C', email: 'Sathiyamoorthi.c85085@gmail.com', password: 'ES24EI27', role: 'Admin', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU027/100/100', classId: 'CLS01', rollNumber: 'ES24EI27', registerNumber: '2403730410721027', mobileNumber: '6374517771' },
    { id: 'STU028', name: 'SRI DHARANI D', email: 'srinithi10062007@gmail.com', password: 'ES24EI28', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU028/100/100', classId: 'CLS01', rollNumber: 'ES24EI28', registerNumber: '2403730410722029', mobileNumber: '9342518553' },
    { id: 'STU029', name: 'SRINITHI R', email: 'drevathidharani1@gmail.com', password: 'ES24EI29', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU029/100/100', classId: 'CLS01', rollNumber: 'ES24EI29', registerNumber: '2403730410722028', mobileNumber: '6381351129' },
    { id: 'STU030', name: 'VISHAL M', email: 'vishaljerry3344@gmail.com', password: 'ES24EI30', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU030/100/100', classId: 'CLS01', rollNumber: 'ES24EI30', registerNumber: '2403730410721030', mobileNumber: '9487274814' },
    { id: 'STU031', name: 'VIVEKA B', email: 'vivekauniverse@gmail.com', password: 'ES24EI31', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU031/100/100', classId: 'CLS01', rollNumber: 'ES24EI31', registerNumber: '2403730410722031', mobileNumber: '9994704588' },
    { id: 'STU032', name: 'RAMALINGAM M', email: 'ramalingamramalingam337@gmail.com', password: 'ES25LEI01', role: 'Student', department: 'Electronics and Communication Engineering', imageUrl: 'https://picsum.photos/seed/STU032/100/100', classId: 'CLS01', rollNumber: 'ES25LEI01', registerNumber: '2403730410721301', mobileNumber: '6383727184' },

    // Faculty & Staff
    { id: 'USR003', name: 'Dr. Sameer Verma', email: 'sameer.verma@example.com', password: 'password123', role: 'Faculty', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR003/100/100' },
    { id: 'USR004', name: 'Dr. Ananya Gupta', email: 'ananya.gupta@example.com', password: 'password123', role: 'HOD', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR004/100/100' },
    { id: 'USR005', name: 'Mr. Rajesh Kumar', email: 'rajesh.kumar@example.com', password: 'password123', role: 'Admin', department: 'Administration', imageUrl: 'https://picsum.photos/seed/USR005/100/100' },
    { id: 'USR006', name: 'Ms. Sunita Reddy', email: 'sunita.reddy@example.com', password: 'password123', role: 'Faculty', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR006/100/100' },
    { id: 'USR007', name: 'Prof. Vikram Rao', email: 'vikram.rao@example.com', password: 'password123', role: 'HOD', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR007/100/100' },
    { id: 'USR008', name: 'Dr. Nisha Iyer', email: 'nisha.iyer@example.com', password: 'password123', role: 'Advisor', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR008/100/100', classId: 'CLS01' },
    { id: 'USR009', name: 'Mr. Alok Verma', email: 'alok.verma@example.com', password: 'password123', role: 'Advisor', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR009/100/100', classId: 'CLS02' },
    { id: 'USR010', name: 'Sathiyamoorthi C', email: 'sathiyamoorthi.c4546@gmail.com', password: 'password123', role: 'Admin', department: 'Administration', imageUrl: 'https://picsum.photos/seed/USR010/100/100' },
];

export const mockDepartments: Department[] = [
    { id: 'DPT01', name: 'Computer Science' },
    { id: 'DPT02', name: 'Electrical Engineering' },
    { id: 'DPT03', name: 'Mechanical Engineering' },
    { id: 'DPT04', name: 'Civil Engineering' },
    { id: 'DPT05', name: 'Electronics and Communication Engineering'}
];

export const mockClasses: Class[] = [
    { id: 'CLS01', name: 'II Year, Section A', departmentId: 'DPT05' },
    { id: 'CLS02', name: 'III Year, Section B', departmentId: 'DPT02' },
];


export const mockViolations = [
  "Improper hairstyle",
  "No ID card",
  "Shoes not polished",
  "Incorrect uniform color",
  "Missing tie",
];

export const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 'ATT001',
    name: 'ABHI RUBEN S',
    userId: 'STU001',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU001/40/40',
    periods: [
        { period: 1, subject: 'Data Structures', status: 'Compliant' },
        { period: 2, subject: 'Algorithms', status: 'Compliant' },
        { period: 3, subject: 'Database Systems', status: 'Non-Compliant', violation: 'No ID card' },
        { period: 4, subject: 'Operating Systems', status: 'Compliant' },
    ]
  },
  {
    id: 'ATT002',
    name: 'ABINAYASRI V',
    userId: 'STU002',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU002/40/40',
    periods: [
        { period: 1, subject: 'Data Structures', status: 'Compliant' },
        { period: 2, subject: 'Algorithms', status: 'Compliant' },
        { period: 3, subject: 'Database Systems', status: 'Compliant' },
        { period: 4, subject: 'Operating Systems', status: 'Absent' },
    ]
  },
   {
    id: 'ATT003',
    name: 'BANNARI SANKAR M',
    userId: 'STU003',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU003/40/40',
    periods: [
        { period: 1, subject: 'Circuit Theory', status: 'Non-Compliant', violation: 'Improper hairstyle' },
        { period: 2, subject: 'Digital Electronics', status: 'Compliant' },
        { period: 3, subject: 'Signal Processing', status: 'Compliant' },
        { period: 4, subject: 'Control Systems', status: 'Compliant' },
    ]
  },
   {
    id: 'ATT004',
    name: 'CIBIVARSHAN K',
    userId: 'STU004',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU004/40/40',
    periods: [
        { period: 1, subject: 'Circuit Theory', status: 'Absent' },
        { period: 2, subject: 'Digital Electronics', status: 'Absent' },
        { period: 3, subject: 'Signal Processing', status: 'Compliant' },
        { period: 4, subject: 'Control Systems', status: 'Non-Compliant', violation: 'Shoes not polished' },
    ]
  },
];


export const mockTimetables: Timetable[] = [
    {
        id: 'TT01',
        departmentId: 'DPT01', // Computer Science
        imageUrl: 'https://picsum.photos/seed/TT01/1200/600',
        schedule: [
            { period: 1, day: 'Monday', subject: 'Data Structures', faculty: 'Dr. Sameer Verma', time: '09:00 - 10:00' },
            { period: 2, day: 'Monday', subject: 'Algorithms', faculty: 'Dr. Sameer Verma', time: '10:00 - 11:00' },
            { period: 3, day: 'Monday', subject: 'Database Systems', faculty: 'Guest Lecturer', time: '11:15 - 12:15' },
            { period: 4, day: 'Monday', subject: 'Operating Systems', faculty: 'Prof. Aditi Rao', time: '01:00 - 02:00' },
            { period: 5, day: 'Tuesday', subject: 'Data Structures', faculty: 'Dr. Sameer Verma', time: '09:00 - 10:00' },
        ]
    },
    {
        id: 'TT02',
        classId: 'CLS01', // ECE II Year, Section A
        departmentId: 'DPT05',
        imageUrl: 'https://picsum.photos/seed/TT02/1200/600',
         schedule: [
            { period: 1, day: 'Monday', subject: 'Network Theory', faculty: 'Prof. ECE1', time: '09:00 - 10:00' },
            { period: 2, day: 'Monday', subject: 'Digital Logic', faculty: 'Prof. ECE2', time: '10:00 - 11:00' },
            { period: 3, day: 'Monday', subject: 'EMF Theory', faculty: 'Prof. ECE3', time: '11:15 - 12:15' },
            { period: 4, day: 'Monday', subject: 'Signals & Systems', faculty: 'Prof. ECE4', time: '01:00 - 02:00' },
            { period: 5, day: 'Tuesday', subject: 'Network Theory', faculty: 'Prof. ECE1', time: '09:00 - 10:00' },
        ]
    },
     {
        id: 'TT03',
        classId: 'CLS02', // EE III Year, Section B
        departmentId: 'DPT02',
        imageUrl: 'https://picsum.photos/seed/TT03/1200/600',
         schedule: [
            { period: 1, day: 'Monday', subject: 'Circuit Theory', faculty: 'Ms. Sunita Reddy', time: '09:00 - 10:00' },
            { period: 2, day: 'Monday', subject: 'Digital Electronics', faculty: 'Ms. Sunita Reddy', time: '10:00 - 11:00' },
            { period: 3, day: 'Monday', subject: 'Signal Processing', faculty: 'Prof. Vikram Rao', time: '11:15 - 12:15' },
            { period: 4, day: 'Monday', subject: 'Control Systems', faculty: 'Guest Lecturer', time: '01:00 - 02:00' },
            { period: 5, day: 'Tuesday', subject: 'Circuit Theory', faculty: 'Ms. Sunita Reddy', time: '09:00 - 10:00' },
        ]
    },
    {
        id: 'TT04',
        departmentId: 'DPT05', // ECE
        imageUrl: 'https://picsum.photos/seed/TT04/1200/600',
        schedule: [
            { period: 1, day: 'Monday', subject: 'Network Theory', faculty: 'Prof. ECE1', time: '09:00 - 10:00' },
            { period: 2, day: 'Monday', subject: 'Digital Logic', faculty: 'Prof. ECE2', time: '10:00 - 11:00' },
            { period: 3, day: 'Monday', subject: 'EMF Theory', faculty: 'Prof. ECE3', time: '11:15 - 12:15' },
            { period: 4, day: 'Monday', subject: 'Signals & Systems', faculty: 'Prof. ECE4', time: '01:00 - 02:00' },
            { period: 5, day: 'Tuesday', subject: 'Network Theory', faculty: 'Prof. ECE1', time: '09:00 - 10:00' },
        ]
    }
];
