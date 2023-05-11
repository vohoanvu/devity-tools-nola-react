import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
//ReactModal.setAppElement("#root"); 
// Set the root element for accessibility

const ConfirmationDialog = ({ title, message, isDialogOpen, modalType, onModalCloseCallback, appElementId = "#root" }) => 
{
    ReactModal.setAppElement(appElementId);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
        setIsModalOpen(isDialogOpen);
    }, [isDialogOpen]);

    function handleDialogClose() {
        setIsModalOpen(false);
        if (onModalCloseCallback !== null) onModalCloseCallback();
    }

    return (
        <div>
            <ReactModal 
                isOpen={isModalOpen}
                onRequestClose={() => console.log("Custom logic on closing...")}
                style={{
                    content: {
                        width: "50%",
                        height: "50%",
                        margin: "auto",
                    },
                    overlay: {
                        zIndex: 1
                    }
                }}>
                <h2>{title}</h2>
                <p>{message}</p>
                {//Decide whether the Modal should be closeable
                    (() => {
                        switch (modalType) {
                        case 429: //rate limit reached
                            return null;
                        case 401: //authorized
                            return null;
                        case 402: //free storage reached
                            return <button onClick={handleDialogClose}>Close Modal</button>;
                        default:
                            return <button onClick={handleDialogClose}>Close Modal</button>;
                        }
                    })()
                }
            </ReactModal>
        </div>
    );
};
  
export default ConfirmationDialog;