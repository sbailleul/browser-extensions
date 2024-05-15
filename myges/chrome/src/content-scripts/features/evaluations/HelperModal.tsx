import { useEvaluationPreferences } from "@/content-scripts/features/evaluations/hooks";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import ModalBody from "react-bootstrap/esm/ModalBody";
import ModalFooter from "react-bootstrap/esm/ModalFooter";
import ModalHeader from "react-bootstrap/esm/ModalHeader";

export function HelperModal() {
  const [isConfirmed, setIsConfirmed] = useEvaluationPreferences();
  const [open, setIsOpen] = useState(!isConfirmed);
  return (
    <Modal modal show={open} onHide={() => setIsOpen(false)}>
      <ModalHeader closeButton>
        Saisie des notes depuis le presse papier
      </ModalHeader>
      <ModalBody>
        Quelques règles :
        <ul>
          <li>CSV dans le presse papier</li>
          <li>Séparateur tabulations</li>
          <li>Colonnes dans l'ordre : Score Nom Prénom</li>
          <li>Format du score : score/20 ou score</li>
        </ul>
        Exemple : <br />
        Score Nom Prénom <br />
        11 John Doe <br />
        14 Tania Marie <br />
      </ModalBody>
      <ModalFooter>
        <Form>
          <Form.Switch // prettier-ignore
            id="confirmSwitch"
            label="Ne plus afficher"
            checked={isConfirmed}
            onChange={(e) => {
              setIsConfirmed(e.target.checked);
            }}
          />
        </Form>

        <Button onClick={() => setIsOpen(false)}>Fermer</Button>
      </ModalFooter>
    </Modal>
  );
}
