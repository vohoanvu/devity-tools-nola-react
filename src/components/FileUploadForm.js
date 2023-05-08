import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ConfirmationDialog from "../components/ConfirmationDialog";
import $ from "jquery";

const FileUploadForm = (props) => 
{
    const axios = props.axios;
    const children = props.children;
    const [uploadError, setUploadError] = useState({
        isFailed: false,
        title: "",
        message: "",
        code: 200
    });

    useEffect(()=> {
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        // Check if any files were dropped
        if (acceptedFiles.length === 0) {
            return;
        }

        // Get the first dropped file
        const file = acceptedFiles[0];

        // Create a FormData object to hold the file data
        const formData = new FormData();
        formData.append("file", file);

        $("div[data-panel=" + props.widgetType + "] .gear").addClass("rotate");
        await axios.post("/api/widgets/upload-json", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(response => {
            console.log("File uploaded successfully:", response.status);
            return response.data;
        }).then(result => {
            console.log("Upload result: ", result);
            console.log("Current reload flag...", props.reloadFlag);
            props.setReloadFlag(true);
            $("div[data-panel=" + props.widgetType + "] .gear").removeClass("rotate");
        }).catch(err => {
            console.log("An error occurred while uploading the file: ", err.response);
            setUploadError({
                isFailed: true,
                title: "File Upload Failed Request!",
                message: err.response.data.message + " Please close this modal and retry!",
                code: err.response.status
            });
            $("div[data-panel=" + props.widgetType + "] .gear").removeClass("rotate");
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [axios]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div 
            {...getRootProps({ onClick: (event) => event.stopPropagation() })}
            style={{ backgroundColor: isDragActive ? "lightgreen" : "inherit" }}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <span>Drop the file here...</span>
            ) : (
                <span style={{ display: "none" }}>Drag and drop a file here, or click to select a file</span>
            )}
            {children}
            <ConfirmationDialog
                title={uploadError.title}
                message={uploadError.message}
                isDialogOpen={uploadError.isFailed}
                modalType={uploadError.code}
                onModalCloseCallback={null}
            />
        </div>
    );
};

export default FileUploadForm;