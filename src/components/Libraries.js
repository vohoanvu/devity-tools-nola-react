import {useState} from 'react';
import axios from 'axios';
import $ from "jquery";
import btn_image_config from "../img/d_btn_ctrl_config.png";
const Libraries = () => {
  const [data, setData] = useState({data: {}});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  // const handleClick = async () => {
  //   setIsLoading(true);
  //   try {
  //     const {data} = await axios.get('/libs/git_cheatsheet.json', {
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     });

      

  //     console.log('data is: ', JSON.stringify(data, null, 4));

  //     setData(data);
  //   } catch (err) {
  //     setErr(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleSelect = async () => {
    setIsLoading(true);

    var lib_file_name = "/libs/" + $('#ddl_library').find(":selected").val();

    try {
      const {data} = await axios.get(lib_file_name, {
        headers: {
          Accept: 'application/json',
        },
      });

      console.log('data is: ', JSON.stringify(data, null, 4));

      setData(data);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = async () => {
    var filter_term = $('#library-filter').val().toLowerCase();

    $(".lib-tbl").find(".lib-tbl-row").filter(() => {
      return $(this).toggle( $(this).text().toLowerCase().indexOf(filter_term) > -1 );
    });
  };

  const handleRowClick = event => {
    var text = $(event.currentTarget).find('.lib-tbl-row-cmd').text();

    $(event.currentTarget).animate({ opacity: '0.1' }, "fast");
    $(event.currentTarget).animate({ opacity: '1' }, "fast");
    

    navigator.clipboard.writeText(text).then(function() {
      console.log(text);
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });

  };



  console.log(data);

  return (
              <div className='p-panel library' data-panel='LIBRARIES'>
              <div className='p-chrome'>
                <img  src={btn_image_config} className='gear' />
                <span className='p-title'>Libraries</span>
              </div>
              <div className='p-contents'>


      {err && <h2>{err}</h2>}

 
      <select id="ddl_library" onChange={handleSelect} style={{ display : "inline-block" }}>
        <option value="select">Select Library</option>
        <option value="git_cheatsheet.json">Git Cheatsheet</option>
        <option value="npm_cheatsheet.json">NPM Cheatsheet</option>
      </select>
      <div className='library-fl' style={{ display : "inline-block" }}>
        <span className="label">Filter: </span><input onKeyUp={handleKeyUp} id='library-filter' type='text'></input>
      </div>


      {isLoading && <h2>Loading...</h2>}

      <div className='library-hd'>
        <span>{data.Title}</span>
        <span>{data.Description}</span>
        <span>{data.Version}</span>
        <span>{data.Type}</span>
      </div> 
        
        <table className='lib-tbl'>
          <thead>
            <tr>
              <th>Command (click to copy)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>

          {data.Items?.map(i => {
                      return (
                        <tr className='lib-tbl-row' onClick={handleRowClick} >
                          <td className="lib_content lib-tbl-row-cmd" dangerouslySetInnerHTML={{__html: i.Command}}></td>
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
