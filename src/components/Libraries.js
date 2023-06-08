import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import btn_image_config from "../img/d_btn_ctrl_config.png";
const UserSelectedLibrary = "curr_lib";

const Libraries = (props) => 
{
    const [data, setData] = useState({data: {}});
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        let libName = localStorage.getItem(UserSelectedLibrary);
        $("#ddl_library_select").val(libName);
        var lib_file_name = "/libs/" + libName;
        if (lib_file_name === "/libs/null") return;

        fetchData(lib_file_name);
    }, []);

    const fetchData = async (lib_file_name) => {
      
        setIsLoading(true);
        try {

            if(lib_file_name === "/libs/select"){
                setData({});
                return;
            }

            const {data} = await axios.get(lib_file_name, {
                headers: {
                    Accept: "application/json",
                },
            });

            //console.log('data is: ', JSON.stringify(data, null, 4));

            setData(data);
        } catch (err) {
            console.log(err);
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = async (e) => {
        localStorage.setItem(UserSelectedLibrary, e.target.value);
        var lib_file_name = "/libs/" + e.target.value;

        fetchData(lib_file_name);
    };

    const handleRowClick = event => {
        var text = $(event.currentTarget).find(".lib-tbl-row-cmd").text();

        $(event.currentTarget).animate({ opacity: "0.1" }, "fast");
        $(event.currentTarget).animate({ opacity: "1" }, "fast");
    
        navigator.clipboard.writeText(text).then(function() {
            console.log(text);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });

    };

    return (
        <div className='p-panel library border' style={{display:"none"}} data-panel='LIBRARIES' >
            <div className='p-chrome'>
                <img  src={btn_image_config} className='gear' alt="devity gear" />
                <span className='p-title'>Libraries</span>
            </div>
            <div className='p-contents'>


                {err && <span className="error">{err}</span>}

                <div id="library-hd">
                    <select id="ddl_library_select" onChange={handleSelect} >
                        <option value="select">Select Library</option>
                        <option value="git_cheatsheet.json">Git Cheatsheet</option>
                        <option value="npm_cheatsheet.json">NPM Cheatsheet</option>
                        <option value="yarn_cheatsheet.json">Yarn Cheatsheet</option>
                        <option value="gulp_cheatsheet.json">Gulp Cheatsheet</option>
                        <option value="nx-dotnet_cheatsheet.json">Nx-dotnet Cheatsheet</option>
                        <option value="powershell_cheatsheet.json">Powershell Cheatsheet</option>
                        <option value="azurecli-powershell_cheatsheet.json">AzureCLI-PS Cheatsheet</option>
                    </select>

                    <div className="library-hd">
                        <span>Title: </span><span>{data.Title}</span><br />
                        <span>Description: </span><span>{data.Description}</span><br />
                        <span>Version: </span><span>{data.Version}</span><br />
                        <span>Type: </span><span>{data.Type}</span><br />
                    </div>
                </div>
        
                <table className='lib-tbl'>
                    <thead>
                        <tr>
                            <th>Command (click to copy)</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>

                        {data.Items?.map((i,index) => {
                            return (
                                <tr key={index} className='lib-tbl-row' onClick={handleRowClick} >
                                    <td className="lib_content lib-tbl-row-cmd filterable" dangerouslySetInnerHTML={{__html: i.Command}}></td>
                                    <td className="lib_content" dangerouslySetInnerHTML={{__html: i.Details}}></td>
                                </tr>
                            );
                        })}

                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='2'></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Libraries;
