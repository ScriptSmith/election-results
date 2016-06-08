// Request XML data
var x = new XMLHttpRequest();
x.open("GET", "aec-mediafeed-results-detailed-verbose-17496.xml", true);
x.onreadystatechange = function () {
  if (x.readyState == 4 && x.status == 200)
  {
    //Change loading status
    $("#loading").text("Loading Graphs...")

    // Parse XML
    var doc = x.responseXML;
    contests = doc.getElementsByTagName("Contest")

    // Iterate through the electorates
    for(var i = 0; i < 150; i++){
        // Default Structure
        data = {
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

        // Find the electorate's name
        var contestName = contests[i].getElementsByTagName("ContestName")[0].childNodes[0].nodeValue;
        options.title.text = contestName;
        console.log(contestName)

        // Create grid element
        var block = document.createElement("div")
        block.id = contestName;
        block.className = "col-sm-4 graph";

        // Create graph canvas
        var ctx = document.createElement("canvas");
        ctx.width = 400;
        ctx.height = 400;
        ctx.id = contestName;

        // Add graph to document
        document.body.appendChild(block)
        block.appendChild(ctx)

        // Find candidates based on first preferences
        var firstPrefs = contests[i].getElementsByTagName("FirstPreferences")[0];
        var candidates = firstPrefs.getElementsByTagName("Candidate");

        // Iterate through candidates
        for(var j = 0; j < candidates.length; j++){
            // Add candidate details to graph
            var candidateName = candidates[j].getElementsByTagName("CandidateName")[0].childNodes[0].nodeValue;
            data.labels.push(candidateName);

            var candidatePercentage = candidates[j].getElementsByTagName("Votes")[0].getAttribute("Percentage");
            data.datasets[0].data.push(candidatePercentage);

            // Set default color
            var candidateColor = "yellow";

            // Determine independance status
            if (candidates[j].getAttribute("Independent") != "true" && candidates[j].getAttribute("NoAffiliation") != "true"){
                var candidateParty = candidates[j].getElementsByTagName("AffiliationIdentifier")[0].getAttribute("ShortCode");
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
    // Remove loading notice
    $("#loading").hide();
  }
};
x.send(null);

$(document).ready(function() {
    $("#search").keyup(function(){
        var value = $("#search").val().toLowerCase();

        // Remove contests not containing search string
        $('.graph').each(function(i, obj) {
            if(!$(this).attr('id').toLowerCase().includes(value)){
                $(this).hide();
            } else {
                $(this).show();
            }
        });    
    });
});