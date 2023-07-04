// * 1 - started
// * 2 - pending datalogger pick up
// * 3 - on client facilities
// * 4 - report in progress
// * 5 - pending approval
// * 6 - approved
// * 7 - not approved


const clientsInfo = {
    [1]:{projectName: 'Medtronic 01/01/2020 CR3', studyID: 1, status: 'Pending Datalogger Pickup'},
    [2]:{projectName: 'Medtronic 01/01/2020 CR1', studyID: 2, status: 'Pending Datalogger Pickup'},
    [3]:{projectName: 'Medtronic 01/01/2020 CR2', studyID: 3, status: 'Pending Datalogger Pickup'},
    [4]:{projectName: 'Medtronic 01/01/2021 CR1', studyID: 4, status: 'Pending Datalogger Pickup'},
    [5]:{projectName: 'Medtronic 01/01/2021 CR2', studyID: 5, status: 'Pending Datalogger Pickup'},
}

const dlQty = 90;

const clientName = "Medtronic";

export {clientsInfo, clientName, dlQty};