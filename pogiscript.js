// function fetchData () {
    fetch('https://worldtimeapi.org/api/timezone/PST8PDT')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(timeData => {
        console.log('OC Time:', timeData.datetime);
        let ocTimeArray = timeData.datetime.split(".")
        let ocTimeFormat = ocTimeArray[0] + ".000";
        let ocTime = new Date(ocTimeFormat)
        // console.log('OC Time:', ocTime);

        fetch('https://api.cmh.platform-prod2.evinternal.net/operations-center/api/Team')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })

            .then(teamData => {
                let dictTeam = new Map();
                teamData.forEach((tData) => {
                    // console.log(tData.name);
                    dictTeam.set(tData.teamId, tData.name);
                    // console.log(tData.name);
                })
                let teamText = dictTeam.get(121);
                // console.log(teamText)

                // Specify the API endpoint for user data
                const apiUrl = 'https://api.cmh.platform-prod2.evinternal.net/operations-center/api/TaskTrafficView/?type=16&value=beingmeasured&type=26&value=true&type=30&value=Test&type=30&value=Pilot&type=18&value=HQ&type=30&value=Training&type=21&value=assignment&';
                let temp = "";
                let fileCount = 0;

                // Make a GET request using the Fetch API
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(apiData => {
                        // Process the retrieved user data
                        // console.log('Data:', apiData.reportID);
                        // var temp = "";
                        apiData.forEach((itemData) => {
                            // console.log('Data:', itemData.reportID);
                            fileCount++;
                            // temp += "<tr>";
                            // temp += "<td>" + itemData.reportID + "</td>";
                            // temp += "<td>" + itemData.primaryProductName + "</td>";
                            // temp += "<td>" + itemData.dueDate + "</td></tr>";

                            fetch('https://api.cmh.platform-prod2.evinternal.net/operations-center/api/Report/' + itemData.reportID)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(reportData => {
                                    // console.log('Hipster:', reportData.isHipsterJob);
                                    // let isHipster = reportData.isHipsterJob;
                                    // let isHipster = "";
                                    let productName = itemData.primaryProductName;
                                    if (reportData.isHipsterJob == true) {
                                        productName = "Hipster";
                                    }

                                    let pmReport = "";
                                    if (reportData.pmReportID != null) {
                                        pmReport = "[PM] ";
                                    }


                                    fetch('https://api.cmh.platform-prod2.evinternal.net/operations-center/api/TaskState/id/' + itemData.taskStateID)
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.json();
                                        })
                                        .then(taskData => {
                                            // console.log(taskData.userID);
                                            let userID = taskData.userID;

                                            fetch('https://api.cmh.platform-prod2.evinternal.net/operations-center/api/User/id?ids=' + userID)
                                                .then(response => {
                                                    if (!response.ok) {
                                                        throw new Error('Network response was not ok');
                                                    }
                                                    return response.json();
                                                })
                                                .then(userData => {
                                                    //console.log(userData)    

                                                    fetch('https://api.cmh.platform-prod2.evinternal.net/operations-center/api/Report/' + itemData.reportID + '/measurement-items')
                                                        .then(response => {
                                                            if (!response.ok) {
                                                                throw new Error('Network response was not ok');
                                                            }
                                                            return response.json();
                                                        })
                                                        .then(mItems => {
                                                            //console.log(userData) 
                                                            //console.log(mItems);
                                                            let mItemsText = "";
                                                            mItems.measurementItems.forEach((mData) => {
                                                                mItemsText += "[" + mData.name + "] ";

                                                            });

                                                            // console.log('Report ID:', itemData.reportID);
                                                            // console.log('Tech:', taskData.description);
                                                            // console.log('Username:', userData[0].userName);
                                                            // console.log('Tech Id:', userData[0].techUsername);
                                                            // console.log(dictTeam.get(userData[0].teamId));
                                                            // console.log('UserID:', taskData.userID);
                                                            // console.log('Product Name:', itemData.primaryProductName);
                                                            // console.log(mItemsText);
                                                            // console.log('Hipster:', reportData.isHipsterJob);
                                                            // console.log('State Time:', taskData.stateTime);
                                                            // console.log('Due Date:', itemData.dueDate);

                                                            temp += "<tr>";
                                                            temp += "<td>" + itemData.reportID + "</td>";
                                                            let techText = taskData.description;
                                                            const techNameArray = techText.split('(')
                                                            techName = techNameArray[1].replace(')', "")

                                                            temp += "<td>" + techName + "</td>";
                                                            temp += "<td>" + dictTeam.get(userData[0].teamId) + "</td>";
                                                            temp += "<td>" + userData[0].userName + "</td>";
                                                            temp += "<td>" + userData[0].techUsername + "</td>";
                                                            temp += "<td>" + itemData.primaryProductName + "</td>";
                                                            temp += "<td>" + pmReport + mItemsText + "</td>";

                                                            let stateTime = new Date(taskData.stateTime);
                                                            let timeElapsed = (ocTime - stateTime) / (1000 * 60); // in minutes
                                                            // console.log(timeElapsed);
                                                            let h = Math.abs(Math.floor(timeElapsed / 60));
                                                            if (h < 10) {
                                                                h = "0" + h;
                                                            }
                                                            let m = Math.abs(Math.floor(timeElapsed % 60));
                                                            if (m < 10) {
                                                                m = "0" + m;
                                                            }
                                                            let s = Math.abs(Math.floor(((timeElapsed % 60) % 1) * 60));
                                                            if (s < 10) {
                                                                s = "0" + s;
                                                            }
                                                            // console.log(s);
                                                            let timeElapsedText = h + ":" + m + ":" + s;
                                                            // if (h < 10) {
                                                            //     timeElapsedText = "0" + h + ":" + m + ":" + s;
                                                            //     if (m < 10) {
                                                            //         timeElapsedText = "0" + h + ":0" + m + ":" + s;
                                                            //         if (s < 10) {
                                                            //             timeElapsedText = "0" + h + ":0" + m + ":0" + s;
                                                            //         }
                                                            //     }
                                                            // }

                                                            // console.log(timeElapsed);
                                                            temp += "<td>" + timeElapsedText + "</td>";

                                                            // let dueDateFormat = new Date(itemData.dueDate);
                                                            // let dueDate = dueDateFormat.toUTCString();
                                                            // dueDate = dueDate.replace("GMT","PST")

                                                            let dueDateTime = new Date(itemData.dueDate);
                                                            let dueDate = Math.floor((dueDateTime - ocTime) / (1000 * 60));
                                                            let nd = ""
                                                            if (dueDate < 0) {
                                                                nd = "-"
                                                            }
                                                            let hd = Math.abs(Math.floor(dueDate / 60));
                                                            if (hd < 10) {
                                                                hd = "0" + hd;
                                                            }
                                                            let md = Math.abs(Math.floor(dueDate % 60));
                                                            if (md < 10) {
                                                                md = "0" + md;
                                                            }
                                                            let sd = Math.abs(Math.floor(((dueDate % 60) % 1) * 60));
                                                            if (sd < 10) {
                                                                sd = "0" + sd;
                                                            }
                                                            let dueDateText = hd + ":" + md + ":" + sd;
                                                            // if (h2 != 0){
                                                            //    dueDateText = h2 + " hr & " + m2 + " min";
                                                            // }

                                                            if (dueDate < 0) {
                                                                temp += "<td style='color:red;'>-" + dueDateText + "</td></tr>";
                                                            }
                                                            else {
                                                                temp += "<td>" + dueDateText + "</td></tr>";
                                                            }

                                                            // temp += "<td>" + dueDateText + "</td></tr>";
                                                            document.getElementById('fileCount').innerHTML = "Report (" + fileCount + ")";
                                                            document.getElementById('data').innerHTML = temp;
                                                            // document.getElementsByTagName('th')[7].click();

                                                        })
                                                });
                                        });
                                });
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

            });

    });
// }