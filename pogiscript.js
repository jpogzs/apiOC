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
        console.log('OC Time:', ocTime);

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
                                    console.log('Report ID:', itemData.reportID);
                                    console.log('Tech:', taskData.description);
                                    console.log('Product Name:', itemData.primaryProductName);
                                    console.log('Hipster:', reportData.isHipsterJob);
                                    console.log('State Time:', taskData.stateTime);
                                    console.log('Due Date:', itemData.dueDate);

                                    temp += "<tr>";
                                    temp += "<td>" + itemData.reportID + "</td>";
                                    let techText = taskData.description;
                                    const techNameArray = techText.split('(')
                                    techName = techNameArray[1].replace(')', "")
                                    temp += "<td>" + techName + "</td>";
                                    temp += "<td>" + pmReport + productName + "</td>";

                                    let stateTime = new Date(taskData.stateTime);
                                    let timeElapsed = Math.floor((ocTime - stateTime) / (1000 * 60));
                                    let h = Math.floor(timeElapsed / 60);
                                    let m = timeElapsed % 60;
                                    let timeElapsedText = m + " min";
                                    if (h != 0) {
                                        timeElapsedText = h + " hr : " + m + " min";
                                    }







                                    // console.log(timeElapsed);
                                    temp += "<td>" + timeElapsedText + "</td>";


                                    // let dueDateFormat = new Date(itemData.dueDate);
                                    // let dueDate = dueDateFormat.toUTCString();
                                    // dueDate = dueDate.replace("GMT","PST")

                                    let dueDateTime = new Date(itemData.dueDate);
                                    let dueDate = Math.floor((dueDateTime - ocTime) / (1000 * 60));
                                    let h2 = Math.floor(dueDate / 60);
                                    let m2 = dueDate % 60;
                                    let dueDateText = h2 + " hours";
                                    // if (h2 != 0){
                                    //    dueDateText = h2 + " hr & " + m2 + " min";
                                    // }






                                    temp += "<td>" + dueDateText + "</td></tr>";
                                    document.getElementById('fileCount').innerHTML = "Report (" + fileCount + ")";
                                    document.getElementById('data').innerHTML = temp;
                                });
                        });











                });
                // document.getElementById('data').innerHTML = window.temp;


            })
            .catch(error => {
                console.error('Error:', error);
            });
    });