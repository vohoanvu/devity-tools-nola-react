import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
ReactModal.setAppElement("#root"); // Set the root element for accessibility

const ConfirmationDialog = ({ title, message, isDialogOpen }) => 
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
            <button onClick={()=> setIsModalOpen(true)} className="logout-btn">
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
                <button onClick={handleDialogClose}>Close Modal</button>
            </ReactModal>
        </div>
    );
};
  
export default ConfirmationDialog;