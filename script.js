const video = document.getElementById('video');
        const wrapper = document.getElementById('playerWrapper');
        const dropZone = document.getElementById('dropZone');
        const errorMsg = document.getElementById('errorMsg');
        
        document.getElementById('fileInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            errorMsg.style.display = 'none';

            const url = URL.createObjectURL(file);
            video.src = url;
            
            dropZone.classList.add('hidden');
            wrapper.classList.add('show-controls');
            
            video.play().catch(err => {
                console.log("Auto-play blocked, waiting for user interaction");
            });
        });

        video.onerror = function() {
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Error: This video format is not supported by your mobile browser.";
            setTimeout(() => errorMsg.style.display = 'none', 4000);
        };

        let controlTimer;

        function showUI() {
            wrapper.classList.add('show-controls');
            clearTimeout(controlTimer);
            if(!video.paused) {
                controlTimer = setTimeout(() => wrapper.classList.remove('show-controls'), 3000);
            }
        }

        document.getElementById('touchCenter').addEventListener('click', function(e) {
            if (!wrapper.classList.contains('show-controls')) {
                showUI();
            } else {
                togglePlay();
            }
        });

        function togglePlay() {
            if(video.paused) {
                video.play();
                flashIcon('iconCenter', 'play_arrow');
            } else {
                video.pause();
                flashIcon('iconCenter', 'pause');
                wrapper.classList.add('show-controls');
            }
            updatePlayBtn();
            showUI();
        }

        document.getElementById('touchLeft').addEventListener('dblclick', () => {
            video.currentTime -= 10;
            flashIcon('iconLeft', 'replay_10');
            showUI();
        });

        document.getElementById('touchRight').addEventListener('dblclick', () => {
            video.currentTime += 10;
            flashIcon('iconRight', 'forward_10');
            showUI();
        });

        function flashIcon(id, iconName) {
            const el = document.getElementById(id);
            el.innerHTML = `<span class="material-icons">${iconName}</span>`;
            el.classList.remove('animate-pop');
            void el.offsetWidth;
            el.classList.add('animate-pop');
        }

        const btnPlay = document.getElementById('btnPlay');
        const fill = document.getElementById('progressFill');
        const curTime = document.getElementById('curTime');
        const durTime = document.getElementById('durTime');

        function updatePlayBtn() {
            btnPlay.innerHTML = video.paused ? 
                '<span class="material-icons">play_arrow</span>' : 
                '<span class="material-icons">pause</span>';
        }

        video.addEventListener('timeupdate', () => {
            if(isNaN(video.duration)) return;
            const pct = (video.currentTime / video.duration) * 100;
            fill.style.width = pct + '%';
            curTime.innerText = formatTime(video.currentTime);
            durTime.innerText = formatTime(video.duration);
        });

        function formatTime(s) {
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${m}:${sec<10?'0':''}${sec}`;
        }

        document.getElementById('progressBar').addEventListener('click', e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });

        document.getElementById('btnPlay').addEventListener('click', togglePlay);
        
        document.getElementById('btnNew').addEventListener('click', () => {
            video.pause();
            video.src = "";
            dropZone.classList.remove('hidden');
        });

        document.getElementById('subInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(!file) return;
            const url = URL.createObjectURL(file);
            const track = document.createElement("track");
            track.kind = "subtitles"; track.label = "Eng"; track.srclang = "en";
            track.src = url; track.default = true;
            video.innerHTML = ''; video.appendChild(track);
            video.textTracks[0].mode = 'showing';
            alert("Subtitle Loaded");
        });

        document.getElementById('btnFull').addEventListener('click', () => {
            if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            } else if (wrapper.requestFullscreen) {
                if (!document.fullscreenElement) wrapper.requestFullscreen();
                else document.exitFullscreen();
            }
        });