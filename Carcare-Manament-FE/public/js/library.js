/*js menu mobile*/
$(document).ready(function ($) {
    $('#trigger-mobile').click(function() {
        $(".mobile-main-menu").addClass('active');
        $(".menu_toggle").addClass('active');
    });
    $('#close-nav').click(function() {
        $(".mobile-main-menu").removeClass('active');
        $(".menu_toggle").removeClass('active');
    });
    $('.menu_toggle').click(function() {
        $(".mobile-main-menu").removeClass('active');
        $(".menu_toggle").removeClass('active');
    });
    $(window).resize( function(){
        if ($(window).width() > 1023) {
            $(".mobile-main-menu").removeClass('active');
            $(".menu_toggle").removeClass('active');
        }
    });
    $('.ng-has-child1 a .fa1').on('click', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.parents('.ng-has-child1').find('.ul-has-child1').stop().slideToggle();
        $(this).toggleClass('active')
        return false;
    });
    $('.ng-has-child1 .ul-has-child1 .ng-has-child2 a .fa2').on('click', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.parents('.ng-has-child1 .ul-has-child1 .ng-has-child2').find('.ul-has-child2').stop().slideToggle();
        $(this).toggleClass('active')
        return false;
    });
});
// --  js CheckOut Page*/
$('[name="payment_method"]').on('click', function () { 
    var $value = $(this).attr('value'); 
    $('.sub_show').slideUp();
    $('.payment_method_' + $value).slideToggle(); 
});
// -- js magiamgia 
$('.mgg-code').click(function () {
    $('.mgg-inputcode').slideToggle(500);
}); 
// --  js Giaohang Page*/
$('[name="gh_method"]').on('click', function () { 
    var $value = $(this).attr('value'); 
    $('.sub_show').slideUp();
    $('.gh_method_' + $value).slideToggle(); 
});    
// -- js xuathoad
$('#is_xhd').click(function () {
$('#xhd-group').slideToggle(600);
});
// menu product
// $('.btn_side_bar').click(function() {
//     $(".side-bar-page-content").addClass('active');
//     $(".side_bar_toggle").addClass('active');
// });
// $('.side_bar_toggle').click(function() {
//     $(".side_bar_toggle").removeClass('active');
//     $(".side-bar-page-content").removeClass('active');
// });
// cate_search_toggle
// $(".cate_search h3").click(function(){
//   $(".drop_cate_search").slideToggle();
// });
// $(".title_category").click(function(){
//   $(".list_category_left").slideToggle();
// });
// slider home
// var swiper = new Swiper(".slider_page", {
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//   });
// slider supplier
// var swiper = new Swiper(".slider_supplier", {
//     slidesPerView: 4,
//     slidesPerColumn: 4,
//     spaceBetween: 10,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerColumn: 2,
//         slidesPerView: 2,
//       },
//       1024: {
//         slidesPerView: 3,
//       },
//     },
//   });
// // slider details product
// var swiper = new Swiper(".pro_small", {
//     spaceBetween: 10,
//     slidesPerView: 4,
//     freeMode: true,
//     watchSlidesVisibility: true,
//     watchSlidesProgress: true,
//   });
//   var swiper2 = new Swiper(".pro_big", {
//     spaceBetween: 10,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     thumbs: {
//       swiper: swiper,
//     },
// });

// // dealhot
// var swiper = new Swiper(".slider_dealhot", {
//     slidesPerView: 4,
//     spaceBetween: 15,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerView: 1,
//       },
//       991: {
//         slidesPerView: 2,
//       },
//     },
//   });
// // category
// var swiper = new Swiper(".slider_category_hot", {
//     slidesPerView: 10,
//     spaceBetween: 15,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerView: 2,
//       },
//       991: {
//         slidesPerView: 6,
//       },
//       1200: {
//         slidesPerView: 7,
//       }
//     },
//   });
// // slider_spr_col
// var swiper = new Swiper(".slider_spr_col", {
//     slidesPerView: 3,
//     spaceBetween: 0,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerView: 1,
//       },
//       991: {
//         slidesPerView: 2,
//       },
//       1200: {
//         slidesPerView: 2,
//       },
//     },
//   });
// // slider_spr_row
// var swiper = new Swiper(".slider_spr_row", {
//     slidesPerView: 1,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerView: 1,
//       },
//       991: {
//         slidesPerView: 1,
//       },
//     },
//   });
// // news
// var swiper = new Swiper(".slider_news", {
//     slidesPerView: 3,
//     spaceBetween: 20,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerView: 1,
//       },
//       991: {
//         slidesPerView: 2,
//       },
//     },
//   });
// // dealhot
// var swiper = new Swiper(".slider_similar", {
//     slidesPerView: 4,
//     spaceBetween: 15,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     breakpoints: {
//       767: {
//         slidesPerView: 2,
//       },
//       991: {
//         slidesPerView: 2,
//       },
//     },
//   });
// số lượng
// $(".qtybutton").on("click", function() {
//     var $button = $(this);
//     var oldValue = $button.parent().find("input").val();
//     if ($button.text() == "+") {
//         var newVal = parseFloat(oldValue) + 1;
//     } else {
//         // Don't allow decrementing below zero
//         if (oldValue > 0) {
//             var newVal = parseFloat(oldValue) - 1;
//         } else {
//             newVal = 0;
//         }
//     }
//     $button.parent().find("input").val(newVal);
// });
// tab mô tả sản phẩm
// $(document).ready(function(){
//     function activeTab(obj)
//     {
//         $('.tab-wrapper_des ul li').removeClass('active');
//         $(obj).addClass('active');
//         var id = $(obj).find('a').attr('href');
//         $('.tab-item-des').hide();
//         $(id) .show();
//     }
//     $('.tab_des li').click(function(){
//         activeTab(this);
//         return false;
//     });
//     activeTab($('.tab_des li:first-child'));
// });
// $(document).ready(function()
// {
//     function activeTab(obj)
//     {
//         $('.tab_wrapper_user ul li').removeClass('active');
//         $(obj).addClass('active');
//         var id = $(obj).find('a').attr('href');
//         $('.tab_item_user').hide();
//         $(id) .show();
//     }
//     $('.list_tab_user .tab li').click(function(){
//         activeTab(this);
//         return false;
//     });
//     activeTab($('.list_tab_user .tab li:first-child'));
// });

/*---------------------
    countdown
  --------------------- */
// function getTimeRemaining(endtime) {
//   var t = Date.parse(endtime) - Date.parse(new Date());
//   var seconds = Math.floor((t / 1000) % 60);
//   var minutes = Math.floor((t / 1000 / 60) % 60);
//   var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
//   var days = Math.floor(t / (1000 * 60 * 60 * 24));
//   return {
//     'total': t,
//     'days': days,
//     'hours': hours,
//     'minutes': minutes,
//     'seconds': seconds
//   };
// }

// function initializeClock(id, endtime) {
//   var clock = document.getElementById(id);
//   var hoursSpan = clock.querySelector('.hours');
//   var minutesSpan = clock.querySelector('.minutes');
//   var secondsSpan = clock.querySelector('.seconds');

//   function updateClock() {
//     var t = getTimeRemaining(endtime);
//     hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
//     minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
//     secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

//     if (t.total <= 0) {
//       clearInterval(timeinterval);
//     }
//   }

//   updateClock();
//   var timeinterval = setInterval(updateClock, 1000);
// }

// var deadline = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000);
// initializeClock('clockdiv', deadline);