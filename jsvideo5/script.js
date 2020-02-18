$(function () {
    if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
        alert("你的浏览器不支持媒体组件!");
        return;
    }

    $.mediaDevices = navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    }).then(function (stream) {
        let streamVideo = $("video.stream").get(0);
        let playVideo = $("video.play").get(0);
        let download = $("a.download");

        streamVideo.srcObject = stream;
        streamVideo.play();

        let recorder = new MediaRecorder(stream);
        $("button.start").click(function () {
            console.log(stream);
            recorder.ondataavailable = function (res) {
                download.attr("href", URL.createObjectURL(res.data));
            };
            recorder.start();
        });

        $("button.end").click(function () {
            streamVideo.pause();
            recorder.stop();
            stream.getTracks().forEach(function (track) {
                track.stop();
            })
        });

        $("button.reset").click(function () {
            playVideo.src = "#";
            download.attr("href", "#");
            // $.mediaDevices();
            streamVideo.resume();
        });

        $("button.play").click(function () {
            playVideo.src = download.attr("href");
            playVideo.play();
        });
    }).catch(function (err) {
        //用户拒绝使用,或者没有摄像头
        alert('您拒绝了使用摄像头,请刷新页面并确认摄像权限!')
    });
});