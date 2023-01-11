import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import CONFIG from "../../config.json";
import "../../css/App.css";
const sso_url = CONFIG.SSO_URL;
const devity_api = CONFIG.DEVITY_API;
const domParser = new DOMParser();


export default function Rss(props)
{
    const [rssWidget, setRssWidget] = useState({});
    const [rssFeed, setRssFeed] = useState(null);

    useEffect(() => {
        const curr_view = props.activePanel;
        const getWidgetContent = async () => {
            if ((curr_view && curr_view !== "DEVITY" && curr_view !== "ALL") || 
                (curr_view === "DEVITY" && rssWidget.w_content)) return;

            getWidgetContentById(props.widget.id).then((widget) => {
                setRssWidget({
                    ...widget,
                    w_content: JSON.parse(widget.w_content)["feedUri"]
                });
            });
        }

        async function fetchFeed(rssUri) {
            return await axios.get(rssUri)
                .then((res) => {
                    console.log("RSS feed", res.data);
                    const xmlDoc = domParser.parseFromString(res.data, "text/xml");
                    const root = xmlDoc.getElementsByTagName("root")[0];
                    const data = {};
                    const children = root.children;
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        data[child.nodeName] = child.textContent;
                    }
                    debugger;
                    setRssFeed(data);
                })
                .then(result => console.log("after PROMISE: ",result))
                .catch((err) => console.log(err));
        }

        getWidgetContent().then(() => {
            if (rssWidget.w_content) {
                fetchFeed(rssWidget.w_content);
            }
        });
        $(`#save-btn-${props.widget.id}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    async function getWidgetContentById(w_id) {
        return await axios.get(devity_api + "/api/widgets/"+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);

                //console.log("Get RSS widget");
                //console.log(res.data);
                return res.data;
            }).then(result => result)
            .catch((err) => console.log(err));
    }

    function handleURIOnChange(event) {
        setRssWidget({
            ...rssWidget,
            w_content: event.target.value
        });
    }

    function saveRssUri() {
        const putBody = {
            ...rssWidget
        }
        saveRssContentUriInDb(putBody);
    }

    async function saveRssContentUriInDb(putBody) {
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
                            onBlur={saveRssUri}
                            style={{width: "100%"}}
                        />
                    )
                }
                {
                    rssFeed && (
                        <div className="rss-item">
                            {
                                rssFeed.channel.map((channel, index) => {
                                    return (
                                        <div key={index}>
                                            <a href={rssFeed.link}>{rssFeed.title}</a>
                                            <p>{rssFeed.description}</p>
                                            <span>{rssFeed.pubDate}</span>
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