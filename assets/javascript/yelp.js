
<div id="searchbox">
    
    <input id="inputZip" type="text" placeholder="search zip code">
    <button type="submit" class="search" id="select-zip">search</button>
        <div class="col-lg-12">
        <div id="yelpResults"></div>
        </div>



   




    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>


    <script>
        //not sure wjy my button wil not work
       // $("#select-zip").on("click", function () {
      //  var zipCode = $("#inputZip");
        // var zipCode = document.getElementById("inputZip").value;
      var zipCode = "85254";
         console.log(zipCode);
        var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" + zipCode +"length=10";




        $.ajax({
            url: myurl,
            headers: {
                'Authorization': 'Bearer _HGtssF-SwR6jLNcaQWBeEq9cMAL_TV-zGK3vFKnQB9Qcyw3d_dMBu4pJWKyRs-1Z6IIyVSUQFH8vNcLCCkHNcE1etuY2g_RZdAxxamKM9iBx3ui9AdQbiuIiJVPW3Yx',
            },
            method: 'GET'
        }).then(function (response) {


            $.each(response.businesses, function (i, item) {
                // Store each business's object in a variable

                console.log(response);

                var restImage = item.image_url;
                var restName = item.name;
     console.log("resturant image",restImage);
     console.log("resturant nam",restName);
        // Append our result into our page
 
        $('#yelpResults').append('<div id=""><b>' + restName + '</b><br><img src="' + restImage + '" style="width:200px;height:150px;"></div>');
    });
 });
</script>   


</body>

</html>