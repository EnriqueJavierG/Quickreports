import { Button, Modal } from '@material-ui/core'
import React, {useState} from 'react'
import NextDataloggerModal from '../components/modals/programmingDl/insertDLtoProgram'
import ProgrammingDL from '../components/modals/programmingDl/programmingDL'
import ProgrammingDoneDL from '../components/modals/programmingDl/programmingDone'
import DataloggerWithoutProfile from '../components/modals/calibration/dlWithoutProfileCal'
import InsertDlToCalibrate from '../components/modals/calibration/insertDLtoCalibrate'
import CalibratingDL from '../components/modals/calibration/calibratingDl'
import CalibrationDoneDL from '../components/modals/calibration/dlCalibrated'
import ErrorReadingDl from '../components/modals/calibration/errorReadingDlCal'
import NewDataloggerModal from '../components/modals/NewDataloggerModal'


function NewDataloggerModalTest() {
    const [modalOpen, setModalOpen] = useState(true);
    const openCloseModal = () => {
        setModalOpen(!modalOpen)
    }
    return (
        <div>
            <Button onClick = {() => openCloseModal()} >
                Go 
            </Button>
            <Modal open={modalOpen} onClose={openCloseModal}>
                < NewDataloggerModal />
            </Modal>
        </div>
    )
}

function ErrorReadingDlTest() {
    const [modalOpen, setModalOpen] = useState(true);
    const openCloseModal = () => {
        setModalOpen(!modalOpen)
    }
    return (
        <div>
            <Button onClick = {() => openCloseModal()} >
                Go 
            </Button>
            <Modal open={modalOpen} onClose={openCloseModal}>
                < ErrorReadingDl />
            </Modal>
        </div>
    )
}

function NextDataloggerModalTest() {
    const [modalOpen, setModalOpen] = useState(true);
    const openCloseModal = () => {
        setModalOpen(!modalOpen)
    }
    return (
        <div>
            <Button onClick = {() => openCloseModal()} >
                Go 
            </Button>
            <Modal open={modalOpen} onClose={openCloseModal}>
                {/* {modalDLConnect} */}
                < NextDataloggerModal />
            </Modal>
        </div>
    )
}



function ProgramDLModalTest () {
    const [mod, setMod] = useState(true);
    const toggleModal = () => {
        setMod(!mod);
    }
    return (
        <div>
            <Button onClick = {() => toggleModal()} >
                Go 
            </Button>
            <Modal open={mod} onClose={toggleModal}>
                <ProgrammingDL dlId={2} />
            </Modal>
        </div>
    )
}

function ProgramDLDoneModalTest() {
    const [mod, setMod] = useState(true);
    const toggleModal = () => {
        setMod(!mod);
    }
    return (
        <div>
            <Button onClick = {() => toggleModal()} >
                Go 
            </Button>
            <Modal open={mod} onClose={toggleModal}>
                <ProgrammingDoneDL dlId={2  } />
            </Modal>
        </div>
    )
}

function DlNotIdentified() {
    const [mod, setMod] = useState(true);
    const toggleModal = () => {
        setMod(!mod);
    }
    return (
        <div>
            <Button onClick = {() => toggleModal()} >
                Go 
            </Button>
            <Modal open={mod} onClose={toggleModal}>
                <DataloggerWithoutProfile  />
            </Modal>
        </div>
    )
}

function InsertDlToCalibrateModalTest() {
    const [mod, setMod] = useState(true);
    const toggleModal = () => {
        setMod(!mod);
    }
    return (
        <div>
            <Button onClick = {() => toggleModal()} >
                Go 
            </Button>
            <Modal open={mod} onClose={toggleModal}>
                <InsertDlToCalibrate />
            </Modal>
        </div>
    )
}

function CalibratingDLModalTest() {
    const [mod, setMod] = useState(true);
    const toggleModal = () => {
        setMod(!mod);
    }
    return (
        <div>
            <Button onClick = { () => toggleModal}>
                Go
            </Button>
            <Modal open={mod} onClose={toggleModal}>
                <CalibratingDL />
            </Modal>
        </div>
    )
}

function CalibrationDoneDLModalTest () {
    const [mod, setMod] = useState(true);
    const toggleModal = () => {
        setMod(!mod);
    }
    return (
        <div>
            <Button onClick = { () => toggleModal}>
                Go
            </Button>
            <Modal open={mod} onClose={toggleModal}>
                <CalibrationDoneDL />
            </Modal>
        </div>
    )
}

export {NextDataloggerModalTest, ProgramDLModalTest, ProgramDLDoneModalTest, DlNotIdentified, InsertDlToCalibrateModalTest, CalibratingDLModalTest,
    CalibrationDoneDLModalTest, ErrorReadingDlTest, NewDataloggerModalTest}