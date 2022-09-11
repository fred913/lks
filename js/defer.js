// 搜索功能
new Vue({
    el: '#submit',
    methods: {
        search_send() {
            let $search = $('#search');
            let inp = $search.val().trim();
            if (inp) {
                $('.web-menu button').eq(0).addClass('active').siblings().removeClass('active');
                $('.group-video').html(`B站博主<a href="https://space.bilibili.com/125526/" target="_blank"> -LKs- </a>《良心到难以置信的网站推荐》`);
                if ($('.bilibili_iframe').css('display') === 'block') {
                    $('.bilibili_iframe').css('display', 'none');
                    $('iframe').attr('src', '');
                }
                $('.web-list .web-grid').each(function () {
                    if (($(this).find('.web-single h2').text() + $(this).find('.web-single p').text()).toUpperCase().search(inp.toUpperCase()) != -1 || $(this).find('.web-single').attr('data-content').toUpperCase().search(inp.toUpperCase()) != -1) {
                        $(this).addClass('filter_web');
                    }
                });
                $('.web-list').isotope({
                    itemSelector: '.web-grid',
                    filter: '.filter_web',
                });
                setTimeout(() => {
                    set_footer();
                    $('.web-list .web-grid').removeClass('filter_web');
                }, 10);
            } else {
                $('.el-message__closeBtn').click();
                this.$message({
                    message: '请输入关键词',
                    type: 'info',
                    center: true,
                    offset: -1,
                    showClose: true,
                });
            }
            $search.val('');
        },
    }
})
$('#search').keydown((e) => {
    if (e.keyCode === 13) {
        $('#submit').click();
    }
});

// 热度排序
localStorage.setItem('is_sort_like_num', 1);
$('#scroll-to-hot').click(function name(params) {
    if (localStorage.getItem('is_sort_like_num') == 1) {
        $grid.isotope({
            sortBy: 'like_num',
            sortAscending: false,
        });
        localStorage.setItem('is_sort_like_num', 0);
    } else {
        $grid.isotope({
            sortBy: 'original-order',
            sortAscending: true,
        });
        localStorage.setItem('is_sort_like_num', 1);
    }
});

// 跳转
$('.web-grid-web mya').click(function name(params) {
    window.open($(this).attr('href'));
    return false;
});
// 点赞
$('.web-grid-web mya p>.iconfont').click(function name(event) {
    console.log('点赞');
    $(this).css('font-size', '20px');
    $(this).css('bottom', '-4px');
    $(this).css('right', '-4px');
    setTimeout(() => {
        $(this).css('font-size', '16px');
        $(this).css('bottom', '-2px');
        $(this).css('right', '-2px');
    }, 300);
    let $this = $(this).parent().parent().parent().parent();
    let $web_grid_web_mya_div = $(this).parent().parent();
    let web_grid = $this.attr('id');
    if (localStorage.getItem(web_grid) == 'like_flag') {
        console.log('已赞');
    } else {
        $.ajax({
            type: "POST",
            // url: 'http://0.0.0.0:8001/api/set_like_num',
            url: 'https://lkszj.info/api/set_like_num',
            data: {
                'web_grid': web_grid,
            },
            error: (res) => {
            },
            success: (res) => {
                console.log(res);
                $this.find('p>.like-num').text(res[web_grid]);
                $this.find('p>.like-num').addClass('like_flag');
                $this.find('p>.iconfont').addClass('like_flag');
                $('.popover-body span.like-num').text(res[web_grid]);
                $('.popover-body span').addClass('like_flag');
                let web_grid_web_mya_div = $web_grid_web_mya_div.attr('data-content');
                web_grid_web_mya_div = web_grid_web_mya_div.replace(/null/g, 'like_flag');
                let web_grid_history = web_grid_web_mya_div.split('</span>')[1].split('>')[1];
                web_grid_web_mya_div = web_grid_web_mya_div.replace(web_grid_history+'<', res[web_grid]+'<');
                $web_grid_web_mya_div.attr('data-content', web_grid_web_mya_div);
                localStorage.setItem(web_grid, 'like_flag');
                // 更新排序数据
                $grid.isotope( 'updateSortData', $grid.children());
            }
        });
    }
    event.stopPropagation();
});

// 控制台
console.log(`
GitHub: https://github.com/xiangjianan

Website: https://www.helloxjn.com

Email: xiang9872@gmail.com

`);

// bootstrap弹框配置（网站简介）
$('[data-toggle="popover"]').popover({
    container: 'body',
    content: '暂无简介',
    placement: 'top',
    trigger: 'hover',
});

// 日访问量统计接口
setTimeout(() => {
    $.ajax({
        type: "POST",
        url: "https://lks.helloxjn.com/share/v1/log/",
        data: {
            'web': 'lks',
        },
    });
}, 2000);

// 免责声明
$('#Disclaimer .modal-body').html(`<p>*本网站由<a href="https://space.bilibili.com/125526/" rel="nofollow noreferrer" target="_blank">LKs</a>和<a href="https://github.com/xiangjianan/" rel="nofollow noreferrer" target="_blank">xiang9872</a>共同制作，展示的所有网站均为个人兴趣收集，不含任何商业推广成分，仅供交流学习。如有网站违反国家政策法规或链接已失效请联系(<a href="mailto:xiang9872@126.com">xiang9872@126.com</a>)，我们会尽快修改。</p>`)
if (!localStorage.getItem('is_show_disclaimer')) {
    localStorage.setItem('is_show_disclaimer', 1);
}
if (localStorage.getItem('is_show_disclaimer') == 1) {
    setTimeout(() => {
        $('#clickDisclaimer').click();
    }, 300);
}
$('#DisclaimerClose').click(() => {
    localStorage.setItem('is_show_disclaimer', 0);
});
