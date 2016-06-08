// Request XML data
var x = new XMLHttpRequest();
x.open("GET", "aec-mediafeed-results-detailed-verbose-17496.xml", true);
x.onreadystatechange = function () {
  if (x.readyState == 4 && x.status == 200)
  {
    // Parse XML
    var doc = x.responseXML;
    contests = doc.getElementsByTagName("Contest")

    // Iterate through the electorates
    for(var i = 0; i < 150; i++){
        // Get contest name
        var contestName = contests[i].getElementsByTagName("ContestName")[0].childNodes[0].nodeValue;
        console.log(contestName)

        // Create grid row
        var row = document.createElement("div")
        row.id = contestName;
        row.className = "row contest";       

        // Create grid heading
        var heading = document.createElement("h1")
        var text = document.createTextNode(contestName);
        heading.appendChild(text);
        row.appendChild(heading);

        //Change loading status
        $("#loading").hide();

        // Iterate through contest results
        var contestResults = ["FirstPreferences", "TwoCandidatePreferred", "TwoPartyPreferred"]
        for(var j = 0; j < contestResults.length; j++){
            // Default graph Structure
            var data = {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: []
                }]

            };

            var options = {
                responsive: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: ""
                },
            }

            // Change graph title
            options.title.text = contestResults[j];

            // Create grid element
            var block = document.createElement("div")
            block.id = contestName;
            block.className = "col-sm-4 graph";

            // Create graph canvas
            var ctx = document.createElement("canvas");
            ctx.width = 400;
            ctx.height = 400;
            ctx.id = contestName;

            // Add graph to row
            row.appendChild(block)
            block.appendChild(ctx)

            // Get results
            var results = contests[i].getElementsByTagName(contestResults[j])[0];

            // Check which type of results
            var prefix;
            var type;
            if(contestResults[j] != "TwoPartyPreferred"){
                prefix = "Candidate";
                type = "Affiliation"
            } else {
                prefix = "Coalition";
                type = "Coalition"
            }
            
            
            // Find candidates based on contest result type
            var candidates = results.getElementsByTagName(prefix);

            // Iterate through candidates
            for(var k = 0; k < candidates.length; k++){
                // Add candidate details to graph
                var candidateName = candidates[k].getElementsByTagName(prefix + "Name")[0].childNodes[0].nodeValue;
                data.labels.push(candidateName);

                var candidatePercentage = candidates[k].getElementsByTagName("Votes")[0].getAttribute("Percentage");
                data.datasets[0].data.push(candidatePercentage);

                // Set default color
                var candidateColor = "yellow";

                // Determine independance status
                if (candidates[k].getAttribute("Independent") != "true" && candidates[k].getAttribute("No" + type) != "true"){
                    var candidateParty = candidates[k].getElementsByTagName(type + "Identifier")[0].getAttribute("ShortCode");
                } else {
                    var candidateParty = "Independent";
                }

                // Change party based on color
                if(["LNP","LP","NP","LNC"].indexOf(candidateParty) != -1){
                    candidateColor = "blue";
                }
                else if(candidateParty == "ALP"){
                    candidateColor = "red";
                }
                else if( candidateParty == "GRN"){
                    candidateColor = "green";
                }

                // Set color
                data.datasets[0].backgroundColor.push(candidateColor);
            }

            // Create the pie chart
            var myPieChart = new Chart(ctx,{
                type: 'pie',
                data: data,
                options: options
            });
        }

        // Add row to document
        document.body.appendChild(row)
         
    }
    // Remove loading notice
    $("#loading").hide();
  }
};
x.send(null);

$(document).ready(function() {
    $("#search").keyup(function(){
        var value = $("#search").val().toLowerCase();

        // Remove contests not containing search string
        $('.contest').each(function(i, obj) {
            if(!$(this).attr('id').toLowerCase().includes(value)){
                $(this).hide();
            } else {
                $(this).show();
            }
        });    
    });
});