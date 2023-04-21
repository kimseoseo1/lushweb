//jquery
$(document).ready(function(){
    const section = $('.wrap > section')
    const footer = $('.footer')

    let sectionSpeed = 500;
    // 섹션간에 바뀌는 스피드

    let sectionPos = [];
    let sectionIndex = 0; //초기값0
    // 각섹션들의 위치값을저장하는배열(저장해야 사이즈가 달라질때 편리함)

    let scrolling = false;
    //막대스크롤링바를 안생기게한다.

    let wheeling = true;
    //풀페이지가 작동된다는 뜻, 휠한번막아주는것
    //화면사이즈체크->화면너비 1000pxp이하에서는 휠작동시켜도 풀페이지식섹션전환이 되지않게 막아주는 변수
    //true -> 풀페이지식 섹션전환이 작동됨

    const sectionMenu = $('.section-menu')

    // resetSection();
    
    // $(window).resize(function(){
    //     wheelCheckFn(); //반복해서 줄이면안보이고 늘이면보이게해줌
    // })

    //각각의섹션에위치파악(y스크롤이동px)
    //화면리사이징이 일어날때마다 호출됨
    // :: 화면리사이징시 변경되는 섹션위치를 다시한번 sectionPos 배열안에 저장함
    function resetSection(){
        sectionPos=[];
        $.each(section,function(index,item){ //요소의각각 wrap의 section들
            let tempY = $(this).offset().top; //각각의 섹션의 위치값(여기선top) 구함
            // console.log(index + ":" + tempY)

            tempY = Math.ceil(tempY); //정수처리해놓으면좋음

            sectionPos[index] = tempY;
            //배열해놓은 값안에 저장
            console.log(sectionPos);
        })
        //index값이안먹힘(위의 내부변수라서), length:6
        sectionPos[sectionPos.length]=Math.ceil(footer.offset().top)
    }
    //최초에 새로고침 또는 실행시 위치값파악 -> sectionPos배열에 저장
    resetSection();

    let sectionTotal = sectionPos.length; 
    // ㄴ> 섹션이몇개인가를저장해놓는곳이total임+footer값도포함 => 7개를 sectiontotal에 집어넣음
    console.log("sectionTotal : " + sectionTotal)

    let resizeTimer;
    $(window).bind('resize',function(){
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resizeFunction,500) //setTimeout=timeout시간을set한다는거임
    })

    //내용물이많이들어 무거워져도 밑내용으로 해주면 에러가 덜발생함.
    function resizeFunction(){  // 위에서불러온 'resizeFunction'라서 콜백함수여서괄호안함
        //리사이즈시 실행할 코드
        wheelCheckFn();
        resetSection();
        if(wheeling){
            //gsap.to($(요소),durationTime,{설정})
            gsap.to($('html'),sectionSpeed/1000,{ 
                //gsap:~까지이동시켜라/ 전환타입은 0.5s동안(위에값설정함)

                scrollTop:sectionPos[sectionIndex],
                //스크롤탑을 각각섹션위치로 이동시켜라.

                onComplete:function(){  //onComplete이벤트함수, 다완성이되면할일~,
                    scrolling = false;  //리사이징될때 위치잡아주려고했던것을 false해라
                },
            });
            
        }
    }

    // $(window).resize(function(){
    //     wheelCheckFn();
    //     resetSection();
    //     if(wheeling){
    //         //gsap.to($(요소),durationTime,{설정})
    //         gsap.to($('html'),sectionSpeed/1000,{ 
    //             //gsap:~까지이동시켜라/ 전환타입은 0.5s동안(위에값설정함)

    //             scrollTop:sectionPos[sectionIndex],
    //             //스크롤탑을 각각섹션위치로 이동시켜라.

    //             onComplete:function(){  //onComplete이벤트함수, 다완성이되면할일~,
    //                 scrolling = false;  //리사이징될때 위치잡아주려고했던것을 false해라
    //             },
    //         }); 
            
    //     }
    // });


    //마우스휠체크 & 섹션이동
    $(window).bind('mousewheel DOMMouseScroll', function (event) {
        let distance = event.originalEvent.wheelDelta;

        // 화면 사이즈에 따른 작동여부
        if (distance == null) {
            distance = event.originalEvent.detail * -1;
        }
        console.log(distance)

        if (wheeling != true) {  //풀페이지모드on
            return; //true아니면 return 해라. -> 1000픽셀이하에서는할일이없으니까나간다.
        }
        // wheeling이 트루일때 연속휠 막0아준다
        if (scrolling) {  //scrolling의 초기값은 false
            return;
        }
        scrolling=true; 
        //★ 마우스휠작동막기=true, flase=마우스휠작동막지않음

        if (distance < 0) {  //distance < 0 -> 음수
            sectionIndex++;  //section의고유넘버
            if (sectionIndex >= sectionTotal) {
                sectionIndex = sectionTotal-1;
            }
            console.log(sectionIndex)

        } else {
            sectionIndex--;
            if (sectionIndex <= 0) {
                sectionIndex = 0;
            }
            console.log(sectionIndex)
        }
        gsap.to($('html'), sectionSpeed / 1000,{
            scrollTo: sectionPos[sectionIndex],
            onComplete: function(){
                scrolling = false
            }
        });

        //스크롤할때마다 해당하는 page메뉴만 보임
        sectionColor();
    })

    //section메뉴클릭시 섹션이동
    const sectionLink = $('.section-menu a')
    $.each(sectionLink, function(index, item){
        $(this).click(function(e){
            e.preventDefault();
            moveSection(index);
            sectionColor();
        })
    })
    function moveSection(_index){
        sectionIndex = _index;  //sectionIndex전역변수임// 전역변수여서 앞에 let쓰면안됨
        gsap.to($('html'), sectionSpeed/1000,{
            scrollTo:sectionPos[sectionIndex], //scroll to ~로가라
            oncomplete: function(){
                scrolling=false;
            }
        })
    }
    function sectionColor(){
        //포커스표현
        sectionLink.removeClass('section-menu-active') //class라고적혔으면 .안찍어야함
        sectionLink.eq(sectionIndex).addClass('section-menu-active')
        //색상표현 (글씨에색상)
        sectionLink.removeClass('section-menu-blue')
        sectionLink.addClass('section-menu-blue')
    }
    //최초또는새로고침시색상셋팅
    sectionColor();
});


// vanilla Javascript
window.onload = function(){
    
};

//swiper
var swiper = new Swiper(".mySwiper", {
	scrollbar: {
		el: ".swiper-scrollbar",
		hide: true,
	},
	autoplay: {
        delete:2000,
        disableOnInteraction: false,
    },
	loop: Infinity,
});

//footer-swiper
var swiper = new Swiper(".main04swiper", {
	scrollbar: {
		el: ".main04-swiper-scrollbar",
		hide: true,
	},
	autoplay: {
        delete:2000,
        disableOnInteraction: false,
    },
	loop: Infinity,
    disableOnInteraction: false,
});

//tab-menu

// $(function () {
// 	var tabAnchor = $('.main03-text-wrap a'),
// 		tabPanel = $('.tab');

// 	tabAnchor.on('mouseover', function (e) {
// 		e.preventDefault();
// 		tabAnchor.removeClass('active');
// 		$(this).addClass('active');
      
// 		var tabIdx = $(this).index();
//         console.log(tabIdx)

// 		tabPanel.hide();
// 		tabPanel.eq(tabIdx).show();

// 	});
// 	tabAnchor.on('click', function (e) {
// 		e.preventDefault();
// 		tabPanel.hide();
// 	});

// 	tabAnchor.eq(0).trigger('click');

// });


$(function () {
    const tabAnchor = $('.main03-text-wrap a'), 
        tabPanel = $('.tab')
         tabAnchor.click(function(e){
            e.preventDefault();
    
            tabAnchor.removeClass('active');
            $(e.currentTarget).addClass("active")
    
            tabPanel.hide();
            let target =$(this).attr('href')
            $(target).show();
    
         })
         tabAnchor.eq(0).trigger("click")
    });
    
//click-on
    // $(function () {
    //     const tabAnchor = $('.main3-touch-tab ul > li a'),
    //         tabPanel = $('.main-event3-list')
    //         //링크를 클릭했을때 할 일
    //          tabAnchor.click(function(e){
    //             e.preventDefault();
        
    //             tabAnchor.removeClass('on'); //전체를 클리어해놓고
    //             $(e.currentTarget).addClass("on")//내가 선택한거 active된다 this로 적어줘도된다 
        
    //             tabPanel.hide(); //display:none;
    //             let target =$(this).attr('href')
    //             $(target).show();
        
    //          })
    //          tabAnchor.eq(0).trigger("click")
    //     });


//게시판 swiper
var swiper = new Swiper(".main03-noticeBox-swiper", {
    direction: 'vertical',
  autoplay: {
        delete:2000,
        disableOnInteraction: false,
    },
  loop: Infinity,
});

//이벤트swiper
var swiper2 = new Swiper(".main03-eventBox-swiper", {
    direction: 'vertical',
    autoplay: {
        delete:2000,
        disableOnInteraction: false,
    },
  loop: Infinity,
});

//캠페인swiper
var swiper3 = new Swiper(".main03-campaignBox-swiper", {
    direction: 'vertical',
  autoplay: {
        delete:2000,
        disableOnInteraction: false,
    },
  loop: Infinity,
});

// 메인사이드메뉴
$(document).ready(function () {

    //모바일 메뉴 펼치기
    //1.모바일 메뉴 불러오기
    const mb_mainmenu = $('.mb-mainmenu')
    //2.모바일 서브메뉴 불러오기
    const mb_submenu = $('.mb-submenu')
    //3.펼쳐진 서브메뉴의 높이값
    let mb_submenu_height = [];

    //4.높이값 계산을 실행
    $.each(mb_submenu, function (index) {
        let count = $(this).find('li').length;
        mb_submenu_height[index] = 45 * count + 22;
    })
    let mb_li = $('.mb-menu > li')
    $.each(mb_mainmenu, function (index) {
        $(this).click(function (e) {
            e.preventDefault();
            $(this).toggleClass('mb-mainmenu-open')
            let active = $(this).hasClass('mb-mainmenu-open');
            if (active) {
                //클릭이 된 경우
                let temp = mb_submenu_height[index]
                mb_li.eq(index).height(temp + 45)
                mb_li.eq(index).siblings().height(45);
                $(this).toggleClass("mb-mainmenu-open")
            } else {
                mb_li.eq(index).height(45);
            }
        })
    })

})

// 상단메뉴
$('.header').hide();
$(window).on('scroll',function(){

    if($(window).scrollTop() > 880){
        $('.header').fadeIn();
        $('.fixed-menu').fadeIn();
    }else{
        $('.header').fadeOut();
        $('.fixed-menu').fadeOut();
    }
})

//rotatingslider
$(function(){ 
    $('.rotating-slider').rotatingSlider({
		slideHeight : Math.min(300, window.innerWidth - 80),
		slideWidth : Math.min(300, window.innerWidth - 80),
	});
});