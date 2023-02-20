import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
ReactModal.setAppElement("#root"); // Set the root element for accessibility

const ConfirmationDialog = ({ title, message, isDialogOpen, modelType }) => 
{
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
        setIsModalOpen(isDialogOpen);
    }, [isDialogOpen]);

    function handleDialogClose() {
        setIsModalOpen(false);
    }

    return (
        <div>
            <button onClick={()=> setIsModalOpen(true)} className="logout-btn" hidden={!isDialogOpen}>
                Open Modal
            </button>
            <ReactModal 
                isOpen={isModalOpen}
                onRequestClose={() => console.log("some custom logic on Closing...")}
                style={{
                    content: {
                        width: "50%",
                        height: "50%",
                        margin: "auto",
                    }
                }}>
                <h2>{title}</h2>
                <p>{message}</p>
                {
                    (() => {
                        switch (modelType) {
                        case "RATE_LIMIT":
                            return null;
                        case "FREE_ACCOUNT_LIMIT":
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