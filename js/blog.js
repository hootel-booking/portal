$(document).ready(function () {
    $.ajax({
        url: "http://localhost:7200/blog",
        method: "GET"
    })
        .done(function (msg) {
           let htmlContent = "";
            let element = document.getElementById("showBlog");

            for (let i in msg.data) {
                htmlContent += `
                 <div  blog-id = "${msg.data[i].id}" class="col-lg-4 col-md-6">
                     <div class="blog-item set-bg" style="background-image: url(./img/blog/${msg.data[i].urlMainImage})"">
                        <div class="bi-text">
                            <span class="b-tag">Travel Trip</span>
                            <h4><a href="./blog-details.html">${msg.data[i].title}</a></h4>
                            <div class="b-time"><i class="icon_clock_alt"></i>${msg.data[i].createDate}</div>
                        </div>
                    </div>
                </div>`
            }
            htmlContent+= `
            <div class="col-lg-12">
                    <div class="load-more">
                        <a href="#" class="primary-btn">Load More</a>
                    </div>
                </div>`;
            console.log("response " + JSON.stringify(msg));
            document.getElementById('showBlog').innerHTML = htmlContent ;
            
        });

        

        
});
