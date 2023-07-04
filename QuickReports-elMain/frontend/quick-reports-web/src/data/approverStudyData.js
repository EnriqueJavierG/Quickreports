// let Study =  function (details){
//     this.id = uuid.v4()
//     this.clientName =(details.clientName) ? details.clientName : details.c_name
//     this.requestDate = (details.requestDate)?  details.requestDate : details.req_date;
//     this.maxTemp = (details.maxTemp)? details.maxTemp : details.s_max_temp;
//     this.minTemp = (details.minTemp) ? details.minTemp : details.s_min_temp;
//     this.maxRH = (details.maxRH) ? details.maxRH : details.s_max_rh;
//     this.minRH =(details.minRH) ? details.minRH : details.s_min_rh;
//     this.dataloggersQty = (details.dataloggersQty) ? details.dataloggersQty : details.s_dl_quantity;
//     this.isApproved = (details.isApproved) ? details.isApproved : details.s_is_approved;
//     this.cleanroomName = (details.cleanroomName) ? details.cleanroomName: details.s_cleanroom;
//     this.samplingFrequency = (details.samplingFrequency) ? details.samplingFrequency : details.s_sampling_frequency;
//     this.reporter_first_name = (details.reporter_first_name) ? details.reporter_first_name : details.r_first_name;
//     this.reporter_last_name = (details.reporter_last_name) ? details.reporter_last_name : details.r_last_name;
//     this.status = (details.status) ? details.status : details.s_status;
//     this.startDate = (details.startDate) ? details.startDate : details.s_start_date
//     this.projectName = this.clientName + this.requestDate
//     this.reporter = `${this.reporter_first_name} ${this.reporter_last_name}`
// }


const data = [
    {id: 7, projectName:'Project 1',status:'Done', clientName:'Medtronic',reporter:'Enrique Gonzalez',requestDate:'05-01-2021',dashboard:'1', report:'1'  },
    {id: 4, projectName:'Project 2',status:'Pending Approval', clientName:'Medtronic',reporter:'Fabiola Badillo',requestDate:'06-01-2021',dashboard:'1', report:'1'  },
    {id: 9, projectName:'Project 3',status:'Done', clientName:'Medtronic',reporter:'Enrique Gonzalez',requestDate:'07-01-2021',dashboard:'1', report:'1'  },
    {id: 8, projectName:'Project 4',status:'Pending Approval', clientName:'HP',reporter:'Pablo Santiago',requestDate:'08-01-2021',dashboard:'1', report:'1'  },
    {id: 2, projectName:'Project 5',status:'Pending Approval', clientName:'Medtronic',reporter:'Enrique Gonzalez',requestDate:'09-01-2021',dashboard:'1', report:'1'  },
    {id: 3, projectName:'Project 6',status:'Not Approved', clientName:'Medtronic',reporter:'Fabiola Badillo',requestDate:'10-01-2021',dashboard:'1', report:'1'  },
    {id: 10, projectName:'Project 7',status:'Pending Approval', clientName:'Medtronic',reporter:'Pablo Santiago',requestDate:'11-01-2021',dashboard:'1', report:'1'  },
    ];

/**
 * 
 * @param {list of Study objects} studies 
 */
const formatApproverDataTable = (studies) => {
    let res = [];
    for (let i = 0; i < studies.length; i++){
        res.push(
            {
                id: studies[i].id,
                projectName: studies[i].projectName,
                status: studies[i].status,
                clientName: studies[0].clientName,
                reporter: studies[0].reporter,
                requestDate: studies[i].requestDate
            }
        )
    }
    return res;
}

const approverData = formatApproverDataTable(data)
// console.log(approverData)

export default approverData;