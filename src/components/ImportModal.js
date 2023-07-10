import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";

export function ImportModal({show, switchShow}) {
    return(
        <Modal show={show} onHide={switchShow}>
            <Modal.Header closeButton>
                <Modal.Title>Import from Transkribus</Modal.Title>
            </Modal.Header>
            <Modal.Body>Log in to Transkribus.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={switchShow}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={switchShow}>
                    Import and Load
                </Button>
            </Modal.Footer>
        </Modal>
    )
}