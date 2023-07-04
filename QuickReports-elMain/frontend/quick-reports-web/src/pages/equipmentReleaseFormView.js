import React from 'react'

function EquipmentReleaseFormView(props) {
    return (
        <div>
            EL EQUIPMENT RELEASE FORM
            {props.match.params.studyID}
        </div>
    )
}

export default EquipmentReleaseFormView
