const clientsAccountsData = [
    {id:1, company: 'Medtronic', requestedProject: 'Medtronic 01/01/2021 CR1', email: 'infopr@medtronic.com', accountStatus: 'pending', actions: '1'},
    {id:2, company: 'ABB', requestedProject: 'ABB 02/02/2021 CR2', email: 'infopr@abb.com', accountStatus: 'granted', actions: '1'},
    {id:3, company: 'J&J', requestedProject: 'J&J 03/03/2021 CR3', email: 'infopr@j&j.com', accountStatus: 'pending', actions: '1'},
    {id:4, company: 'Bard', requestedProject: 'Bard 04/04/2021 CR4', email: 'infopr@bard.com', accountStatus: 'denied', actions: '1'},
];

const reportersAccountData = [
    {id:1, reporter: 'Fabiola Badillo', email: 'fbr@mail.com', employeeId: '048447', role: 'validate', accountStatus: 'pending', actions: '1'},
    {id:2, reporter: 'Enrique Gonzalez', email: 'egm@mail.com', employeeId: '052634', role: 'calibrate', accountStatus: 'granted', actions: '1'},
    {id:3, reporter: 'Pablo Santiago', email: 'psu@mail.com', employeeId: '520315', role: 'validate', accountStatus: 'pending', actions: '1'},
    {id:4, reporter: 'Fabio Morales', email: 'fmj@mail.com', employeeId: '457855', role: 'calibrate', accountStatus: 'denied', actions: '1'},
];

export {clientsAccountsData, reportersAccountData}