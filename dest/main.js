function removeActive (arr) {
    arr.forEach(function(item) {
        item.classList.remove('active');
    })
}
let header = document.querySelector('header');
let sections = document.querySelectorAll('main section')
let menu = document.querySelectorAll('.menu__list li a')
let play = document.querySelectorAll('.circle');
let popup = document.querySelector('.pop_up');
let slider= document.querySelector('.slider');
let heightHeader = header.clientHeight;
let heightSlider = slider.clientHeight;
let hamberger = document.querySelector(".hamberger");
let nav = document.querySelector('.nav');
let sliderItem = document.querySelectorAll('.slider__list--item');
let lang = document.querySelector('.lang');
let langCurrent = document.querySelector('.lang .lang__current span');
let langSelect = document.querySelectorAll('.lang .lang__select span');
let iframe = document.querySelector('.pop_up .pop_up--video iframe');
let toTop = document.querySelector('.back-top');
let textTop = document.querySelector('footer .container .top');


// Background menu
window.addEventListener("scroll" , function() {
    if(window.scrollY >= (heightSlider - heightHeader)) {
             header.style.backgroundColor = "#000";
    } else {
             header.style.backgroundColor = "transparent";
    }
})
// hamberger
hamberger.onclick = function() {
    hamberger.classList.toggle('active');
    nav.classList.toggle('active');
}
window.onresize = () => {
    nav.classList.remove('active');
    hamberger.classList.remove('active');
}
// lang
lang.onclick = () => {
    lang.classList.toggle('active');
}
langSelect.forEach(function(item){
    item.onclick = function () {
        let langTemp = langCurrent.textContent;
        langCurrent.innerHTML = item.textContent;
        item.innerHTML = langTemp;
    }
})
//menu
menu.forEach(function(item,index){
    item.onclick= function(e) {
        e.preventDefault();
        removeActive(menu);
        let classId = document.querySelector('.' + item.getAttribute('href').replace("#" , ""));
        window.scrollTo(0 , (classId.offsetTop - heightHeader ));
    }
})
window.addEventListener('scroll' , function() {
    sections.forEach(function(item,index) {
      if(window.pageYOffset >= (item.offsetTop-heightHeader - 1)) {
          removeActive(menu);
          menu[index].classList.add('active');
      }
    })
})
// pop up

play.forEach(function(item,index) {
    item.onclick = function() {
        popup.classList.add('active');
        let data = item.getAttribute('data-video');
        iframe.setAttribute('src',"https://www.youtube.com/embed/" + data + "?autoplay=1&mute=1");
        console.log(iframe.src)

    }
})
popup.onclick = function() {
    popup.classList.remove('active');
    iframe.setAttribute('src','');
}

// footer 
// textTop.onclick = function() {
//     window.scrollTo(0,0);
// }


//flickity
let $carousel = $('.slider .slider__list')
$carousel.flickity({
    cellAlign: 'left',
    contain: true,
    wrapAround: true,
    prevNextButtons: false,
    on: {
        ready: function() {
            let paging = $('.paging .paging__dotted');
            let dotted = $('.flickity-page-dots');
            dotted.appendTo(paging);
            },
        change: function(index) {
            let number = $('.paging .paging__number span');
            let indexPage = index + 1;
            number.text(indexPage.toString().padStart(2,'0'));
        }
    }
})
$('.control__btn .--prev').on('click' , function(e) {
    e.preventDefault();
    $carousel.flickity('previous')
})
$('.control__btn .--next').on('click' , function(e) {
    e.preventDefault();
    $carousel.flickity('next')
})

var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if(figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML; 
            }
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};
        if(hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }
        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            showAnimationDuration : 0,
            hideAnimationDuration : 0
        };
        if(fromURL) {
            if(options.galleryPIDs) {
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if( isNaN(options.index) ) {
            return;
        }
        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

window.onload = function(){
    initPhotoSwipeFromDOM('.gallery__grid');
};
 
$('.slider .btn_btn').mouseover(function() {
    $(this).css('transition' , '0.3s');
})

$(document).ready(function() {
    $('.slider__gallery').flickity({
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        freeScroll: true,
    });
})