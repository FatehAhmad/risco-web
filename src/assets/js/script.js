$(document).ready(function(){
  /* Delete function of status images */
  $('body').delegate('.upload_images .img-wrap > span', 'click', function(){
    $(this).parent().remove();
  });

	/* ToolTip */
    $('[data-toggle="tooltip"]').tooltip();

    // $('.peoples-comments .heart').on('click', function(){
    //   $(this).toggleClass('icon-heart icon-heart2');
    // });


    // $('.peoples-comments .star').on('click', function(){
    //     $(this).toggleClass('icon-thumbs-o-up icon-thumbs-up2');
    // });


    $('.heart').on('click', function(){
        $(this).toggleClass('icon-heart icon-heart2');
      });
  
  
    $('.star').on('click', function(){
        $(this).toggleClass('icon-thumbs-o-up icon-thumbs-up2');
    });


    $('body').delegate('.sub_comment_btn','click', function(){
      $(this).find('span').toggleClass('act');
      $(this).parents('.actBtns').next('.sub_comment_box').slideToggle();
    });

    $('body').delegate('.sent_sub_comment','click', function(){
      $(this).parent().slideUp();
      $('.peoples-comments span.icon-comment').removeClass('act');
    });

    // /* Main Menu */
    // $('.icon-menu').click(function(){
    //     $(this).next('.header-dropdown').slideDown();
    //     $('.overlay-bg').addClass('show');
    //     $('body').css("position","fixed");
    //     $('body').css("width","100%");
    // });

    $('.dropdown-link > span').click(function(){
    	$(this).next('.header-dropdown').slideDown();
    	$('.overlay-bg').addClass('show');
    	// $('body').css("position","fixed");
    	$('body').css("width","100%");
    });

    // $('.menu li a').on('click', function(){
    //     $('.header-dropdown').slideUp();
    //     $('.overlay-bg').removeClass('show');
    //     $('body').css("position","static");
    // });

    $('.noti-msg-row').on('click', function(){
        $('.header-dropdown').slideUp();
        $('.overlay-bg').removeClass('show');
        $('body').css("position","static");
    });

    // /* Status Update */
    // $('.profilePage .post-panel h4').on('click',function(e){
    //     $(this).parent().find('.update_status').fadeIn();
    //     $('.overlay-bg').addClass('show');
    //      e.preventDefault();
    //       $('html, body').animate({
    //           scrollTop: 300
    //       }, 500);
    // });


    // $('body').delegate('.shareBtn','click', function(){
    //     $('.update_status').fadeOut();
    //     $('body').css("position","static");
    //     $('.overlay-bg').removeClass('show');
    // });

    /* Black overlay Click */
    // $('.overlay-bg').click(function(){
    // 	$(this).removeClass('show');
    // 	$('.header-dropdown').slideUp();
    //     $('body').css("position","static");
    //     $('body').css("overflow","auto");
    //     $('.update_status').fadeOut();
    // });

    /* Follow Button Script */
    $('body').delegate('.follow_panel .custBtn', 'click', function(){

        $(this).toggleClass('follow');
        if($(this).hasClass('follow')) {
            $(this).text('Following');
        } else {
            $(this).text('Follow');
        }
    });

     /* Post Detail Comment */
     $('.user-comment .field').on('click', function(e){
        e.stopPropagation();
        $(this).addClass('act');
        $('.user-comment small').show();
        $('.attach-list').show();
        $('.user-comment .field span').addClass('showIcon');
        $('.user-comment .field .sent_btn').addClass('showIcon');
     });

    
     $('.user-comment .field textarea').click( function(){
        $(".emoji-mart").css("display", "none"); 
        $(".parent-comment-area").removeClass('act')
        $(".child-comment-area").removeClass('act')
     })

     $('.user-comment textarea').click( function(){
        $(".emoji-mart").css("display", "none"); 
        $(".parent-comment-area").removeClass('act')
        $(".child-comment-area").removeClass('act')
     })

     $('.field textarea').click( function(){
        $(".child-emoji-mart > .emoji-mart").css("display", "none")
        $(".parent-comment-area").removeClass('act')
        $(".child-comment-area").removeClass('act')
     })
     
     /* After Submit Comment */
      $('.sent_btn').on('click', function(e){
        $(this).parent().removeClass('act');
        $('.attach-list').hide();
        $('.postdetail span').removeClass('showIcon');
        $('.user-comment .field').removeClass('act');
        $('.sub_comment_btn').find('span').removeClass('act');
        $('.sub_comment_btn').parents('.actBtns').next('.sub_comment_box').hide();
      });

     /* About Readmore */
     $('.about-wid a').on('click', function(){
        $(this).toggleClass('show');
        $('.about-wid p').toggleClass('show');

        if($(this).hasClass('show')){
            $(this).text('Show less');
        } else {
            $(this).text('Show more');
        }

     });

     /* Join Button Script */
    $('body').delegate('.group_panel ul li .join_btn', 'click', function(){

        $(this).toggleClass('cancel');
        if($(this).hasClass('cancel')) {
            $(this).text('Cancel');
        } else {
            $(this).text('Join');
        }
    });


     /* Add Fav Post */
     $('.cart-footer span.icon-thumbs-o-up').on('click', function(){
        $(this).toggleClass('icon-thumbs-o-up icon-thumbs-up2');
     });




});

$(document).click(function(event) {
    $('.user-comment .field').removeClass('act');
    // $('.postdetail .field').removeClass('act');
    //$('.attach-list').hide();

    // $('.people_search input[type="text"]').removeClass('show');
    $('.searchField .add_people_pnl').fadeOut();
    $('.group_search .add_people_pnl').fadeOut(); 
    $('.field .add_people_pnl').fadeOut();
    $(".attach-list").hide();
    //$(".field .emoji-search").css("display", "none");

    //$('.user-comment small').hide();
    //$('.user-comment .field span').removeClass('showIcon');
    $('.more-dropdown').hide();
    $('.profile_more_dropdown').slideUp('fast');

    if ($(event.target).closest(".searchField").length === 0) {
    	$('.searchField .autocomplete_pnl').fadeOut();
    }
    if ($(event.target).closest(".group_search").length === 0) {
    	$('.group_search .autocomplete_pnl').fadeOut();
    }
 });
  function ShowDetail(elem){
      var ToDo = $(elem).attr("myaction");
      if(ToDo == 1){
        $(elem).prev().removeClass("trancate360");
        $(elem).prev().addClass("untrancate360");
        $(elem).attr("myaction",0);
        $(elem).text("Read Less");
      } else {
        $(elem).prev().removeClass("untrancate360");
        $(elem).prev().addClass("trancate360");
        $(elem).attr("myaction",1);
        $(elem).text("Read More");
      }
 }
//  function newitem(elem){   
 
//     $('meta[name=og\\:image]').attr('content',elem);
//     return true;
//  }
