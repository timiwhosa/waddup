var footer = document.querySelector("footer");
var year = new Date().getFullYear();

var html =`<div id="footer-div1"> <div class="logo">
            <div class="logo-logo">
                <a href="https://wa.me/2348140766866?text=Hi%20%0AI'm%20a%20student%20of%20the%20department%20of__%20%0AMy%20name%20is__">
                    <img src="/img/core-img/jetbooks-online.png" alt="jetbooks/futapastquestion.com">
                </a>
            </div>
            <p class="copywrite">Copyright &copy; ${year} All rights reserved | JETbrand.JETbooks. </p>
        </div>
        <div class="navigation-links">
            <p>Nav links</p>
            <ul>
                <li><a href="/home">HOME</a></li>
                <li><a href="/contact">CONTACT</a></li>
                <li><a href="/about">ABOUT</a></li>
                <li><a href="/cgpa-cal">CGPA CALCULATOR</a></li>
                <li><a href="https://wa.me/2348140766866?text=Hi%20%0AI'm%20a%20student%20of%20the%20department%20of__%20%0AMy%20name%20is__">ADVERTISE PRODUCT</a></li>
            </ul>
        </div></div>

        <div class="social-links">
            <!-- <p>Social links</p> -->
            <ul>
                <li><a href="https://wa.me/2348140766866?text=Hi%20%0AI'm%20a%20student%20of%20the%20department%20of__%20%0AMy%20name%20is__"><img src="/img/core-img/whatsapp.png" alt=""></a></li>
                <li><a href="#"><img src="/img/core-img/youtube.png" alt=""></a></li>
                <li><a href="#"><img src="/img/core-img/facebook.png" alt=""></a></li>
                <li><a href="mailto:jetbooks@yahoo.com"><img src="/img/core-img/yahoo.png" alt=""></a></li>
                <li><a href="https://instagram.com/jetbooks.online"><img src="/img/core-img/instagram.png" alt=""></a></li>
            </ul>
        </div>`;

footer.innerHTML = html;