import React, { useEffect, useState } from "react";
import $ from "jquery";
import CONFIG from "../../config.json";
import "../../css/App.css";
const sso_url = CONFIG.SSO_URL;

export default function Rss(props)
{
    const [rssWidget, setRssWidget] = useState({});
    const [rssFeed, setRssFeed] = useState(null);
    const axios = props.axios;

    useEffect(() => {
        const curr_view = props.activePanel;
        const getWidgetContent = async () => {
            if ((curr_view && curr_view !== "DEVITY" && curr_view !== "ALL") || 
                (curr_view === "DEVITY" && rssFeed)) return;

            await getWidgetContentById(props.widget.id).then(widget => {
                setRssWidget(widget);
                fetchFeed(widget.w_content);
            });
        }


        getWidgetContent();

        $(`#save-btn-${props.widget.id}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.isUriChanged, props.activePanel]);

    async function fetchFeed(rssUri) {
        if (rssUri.length === 0) return;

        await axios.post("/api/proxy/rss", { feedUri: rssUri })
            .then(res => {
                const itemsArray = Array.prototype.map.call(res.data, item => {
                    const itemData = {};
                    itemData["title"] = item.title.text;
                    itemData["link"] = item.id;
                    itemData["description"] = item.summary.text;
                    itemData["pubDate"] = item.publishDate;

                    return itemData;
                });
                return itemsArray;
            })
            .then(result => {
                setRssFeed(result);
            })
            .catch((err) => console.log(err));

        //const domParser = new DOMParser();
        // await axios.get(rssUri)
        //     .then(res => {
        //         const xmlDoc = domParser.parseFromString(res.data, "application/xml");
        //         const items = xmlDoc.getElementsByTagName("item");
        //         const itemsArray = Array.prototype.map.call(items, item => {
        //             const itemData = {};
        //             Array.prototype.forEach.call(item.childNodes, child => {
        //                 if(child.nodeName !== "#text") {
        //                     itemData[child.nodeName] = child.textContent;
        //                 }
        //             });
        //             return itemData;
        //         });
        //         return itemsArray;
        //     })
        //     .then(result => setRssFeed(result))
        //     .catch((err) => console.log(err));
    }

    async function getWidgetContentById(w_id) {
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                //console.log("Get RSS widget");
                //console.log(res.data);
                return res.data;
            }).then(result => {
                //transform RSS widget content to feedUri string
                let feedUri = JSON.parse(result.w_content)["FEEDURI"];
                let widget = {
                    ...result,
                    w_content: feedUri ?? ""
                };
                setRssWidget(widget);
                return widget;
            })
            .catch((err) => console.log(err));
    }

    function handleURIOnChange(event) {
        setRssWidget({
            ...rssWidget,
            w_content: event.target.value
        });
        $(`#save-btn-${props.widget.id}`).show();
    }

    function sendUriToParentForSaving() {
        const putBody = {
            ...rssWidget,
            w_content: JSON.stringify({
                FEEDURI: rssWidget.w_content
            })
        }
        props.sendContentToParent(putBody, null, null);
    }

    return (
        <div className="w_overflowable">
            <div className="widget rss">
                {
                    !rssFeed && (
                        <input
                            type="text"
                            name="rssURI"
                            placeholder=""
                            value={rssWidget.w_content ?? ""}
                            onChange={handleURIOnChange}
                            onBlur={sendUriToParentForSaving}
                            style={{width: "100%"}}
                        />
                    )
                }
                {
                    rssFeed && (
                        <div className="rss-item">
                            {
                                rssFeed.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <a href={item.link}>{item.title}</a>
                                            <p>{item.description}</p>
                                            <span>{item.pubDate}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}