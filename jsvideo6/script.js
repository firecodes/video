$(function () {
    let Twinkle;
    let Devicestate;
    if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
        if (navigator.getUserMedia){
            Devicestate = navigator.getUserMedia({
                video: true,
                audio: true,
            });
        } else {
            alert("你的浏览器不支持媒体组件!");
            return;
        }
    }else {
        Devicestate = navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
    }

    Devicestate.then(function (stream) {
        let streamVideo = $("video.stream");
        let playVideo = $("video.play");
        let download = $("a.download");

        streamVideo.get(0).srcObject = stream;
        streamVideo.get(0).play();
        $("span.state").removeClass("none");

        let recorder = new MediaRecorder(stream);
        $("button.start").click(function () {
            console.log("开始录制");
            if (recorder.state === 'inactive') {
                recorder.ondataavailable = function (res) {
                    download.attr("href", URL.createObjectURL(res.data));
                    playVideo.get(0).src = download.attr("href");
                    streamVideo.addClass("none");
                    playVideo.removeClass("none");
                };
                recorder.start();
                $(this).addClass("none");
                $("button.end").removeClass("none");
                Twinkle = setInterval(run,500);
            } else {
                console.log('已开始录制!')
            }
        });

        $("button.end").click(function () {
            console.log("停止录制");
            clearInterval(Twinkle);
            if (recorder.state === 'recording') {
                streamVideo.get(0).pause();
                recorder.stop();
                stream.getTracks().forEach(function (track) {
                    track.stop();
                })
                $(this).addClass("none");
                $("button.reset").removeClass("none");
                $("button.download").removeClass("none");
                $("span.state").addClass("none");
            } else {
                console.log('未开始录制!')
            }
        });

        $("button.reset").click(function () {
            if (!confirm("重新录制将会丢失进度,您确定继续吗?")) {
                return;
            }
            console.log('重新录制!');
            playVideo.get(0).src = "#";
            download.attr("href", "#");
            Devicestate = navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            Devicestate.then(function (res) {
                streamVideo.get(0).srcObject = res;
                streamVideo.get(0).play();
                recorder = new MediaRecorder(res);
            });
            streamVideo.get(0).play();
            $(this).addClass("none");
            $("button.start").removeClass("none");
            $("button.download").addClass("none");
            $("span.state").removeClass("none");
            streamVideo.removeClass("none");
            playVideo.addClass("none");
        });
    });
    Devicestate.catch(function (err) {
        //用户拒绝使用,或者没有摄像头
        alert('未读取到摄像或没有权限!')
    });

//    jq动态闪烁效果
    function run() {
        $(".red-dot").fadeOut(100).fadeIn(100);
    }
});