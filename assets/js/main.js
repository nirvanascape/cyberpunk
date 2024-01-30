


(() => {

    let yOffset = 0; //현재 스크롤 된 수치
    let prevScrollHeight = 0; //현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 총 높이값
    let currentScene = 0; //현재 활성화된 씬(scroll-section)
    let enterNewScene = false;
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [ //각 씬의 정보
        {
            //0
            type: 'sticky', //씬에 스크롤 애니메이션이 있으면 sticky 없으면 normal
            heightNum: 7, //브라우저 높이의 7배로 scrollHeight세팅
            scrollHeight: 0, //각 구간의 스크롤 높이
            objs:{ //씬에 html객체 모음
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                container: document.querySelector('#scroll-section-0'),
                titleLogo: document.querySelector('#logo'),
                headerLink: document.querySelector('#header_links_top'),
                headerPlatforms: document.querySelector('#header_platforms'),
                cyberBtn: document.querySelector('#cyber_btn'),
                canvasDiv: document.querySelector('.sticky-elem-canvas'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
            },
            values:{
                videoImageCount: 718, //이미지 로드를 기다리는데 쓰이는 변수
                imageSequence: [0, 717],
                titleLogo_opacity: [1, 0, { start: 0.8, end:0.9 }],
                titleLogo_translateY: [0, -200, { start: 0.8, end: 1 }],
                cyberBtn_translateY_down: [0, -200, { start: 0.8, end: 1 }],
                cyberBtn_translateY_up: [0, 200, { start: 0.8, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.25, end: 0.35 }],
				messageC_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
				messageD_opacity_in: [0, 1, { start: 0.55, end: 0.65 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.25, end: 0.35 }],
				messageC_translateY_in: [20, 0, { start: 0.4, end: 0.5 }],
				messageD_translateY_in: [20, 0, { start: 0.55, end: 0.65 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageC_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],
				messageD_opacity_out: [1, 0, { start: 0.7, end: 0.75 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageC_translateY_out: [0, -20, { start: 0.55, end: 0.6 }],
				messageD_translateY_out: [0, -20, { start: 0.7, end: 0.75 }]
            }

        },
        {
            //1
            type:'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                background: document.querySelector('#scroll-section-1 .background'),
                yellowPanel: document.querySelector('#scroll-section-1 .text_box')
            },
            values:{
                yellowPanel_rotate: [0, 10, { start: 0.05, end: 0.4 }],
                yellowPanel_translateX: [0, 5, { start: 0.05, end: 0.4 }]
            }
        },
        {
            //2
            type:'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                background: document.querySelector('#scroll-section-2 .background'),
                yellowPanel: document.querySelector('#scroll-section-2 .text_box')
            },
            values:{
                yellowPanel_rotate: [0, -10, { start: 0.05, end: 0.4 }],
                yellowPanel_translateX: [0, -5, { start: 0.05, end: 0.4 }]
            }
        },
        {
            //3
            type:'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                background: document.querySelector('#scroll-section-3 .background'),
                yellowPanel: document.querySelector('#scroll-section-3 .text_box')
            },
            values:{
                yellowPanel_rotate: [0, 10, { start: 0.05, end: 0.4 }],
                yellowPanel_translateX: [0, 5, { start: 0.05, end: 0.4 }]
            }
        },
        {
            //4
            type:'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-4'),
            },
        },
        {
            //5
            type:'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-5'),
            },
        },
        {
            //6
            type:'normal',
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-6'),
            },
        }
    ];

    function setCanvasImages(){
        //videoImages 배열에 이미지 셋팅
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++){
            imgElem = new Image();
            imgElem.src = `../assets/video/video_${2000 + i}.png`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

    }
    
    function setLayout(){
        //각 스크롤 섹션의 높이 셋팅
        for (let i = 0; i < sceneInfo.length; i++){

            if (sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.scrollY;

        
        //스크롤중 새로고침을 하는경우 해당되는 show-scene번호 셋팅
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
        //totalScrollHeight가 현재 스크롤 된 높이보다 크거나 같아지면 현재 sceneInfo의 번호를currentScene에 넣어주고 
        //for문을 멈춤, 이렇게 해서 새로고침 했을 때 현재 씬의 번호에 오류가 나는것을 방지함
    
        //다양한 디바이스에 맞춰 캔버스 크기 맞추기 (height를 꽉차게)
		//const heightRatio = window.innerHeight / 1080;
        // sceneInfo[0].objs.canvasBox.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		// sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio * 1.2})`;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(1.2)`;
        //sceneInfo[1].objs.background.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset){
        //스크롤 되는 범위를 비율에 맞춰서 숫자로 계산
        let rv;

        const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

        //start, end시점이 있을 때에
        if ( values.length === 3) {

            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        //이외의 경우
        }else{
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;

    }

    function playAnimation(){
        const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight; //현재 씬에서 스크롤 된 양
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        //console.log(currentYOffset);

        //해당 씬에서만 애니메이션 작동하도록 분기
        switch (currentScene){
            case 0:
                //console.log('0 play');
                //캔버스의 가로 세로 모두 꽉 차게 하기
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    //캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                }else{
                    //캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }
                //캔버스의 비율을 내고 가로 세로 중 더 긴것에 맞춰 비율 조정
                //objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(1.2)`;

                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.titleLogo.style.opacity = calcValues(values.titleLogo_opacity, currentYOffset);
                objs.titleLogo.style.transform = `translate3d(-50%, ${calcValues(values.titleLogo_translateY, currentYOffset)}%, 0)`;
                //objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                //console.log(sequence);

                if (scrollRatio <= 0.1) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.25) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.4) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.6) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;

                } else if (scrollRatio >= 0.6  &&  scrollRatio <= 0.8){
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.8) {
                    objs.cyberBtn.style.position = 'fixed';
                    objs.cyberBtn.style.top = `${84}vh`;

                    
                } else {
                    objs.cyberBtn.style.position = 'absolute';
                    objs.cyberBtn.style.top = `${(84 * 7) + (7.5 * 7)}vh`;
                    //포지션이 fixed에서 absolute로 바뀌면서 달라지는 속성때문에 top값을 다시 계산해줌
                    //84(버튼의 top위치) * 7(heightNum) + 7.5(버튼의 세로길이) * 7(heightNum)

                }

                break;

            case 1:
                //console.log('1 play');

                if (scrollRatio > 0.01){
                    objs.yellowPanel.style.transform = `rotate(${calcValues(values.yellowPanel_rotate, currentYOffset)}deg) translateX(${calcValues(values.yellowPanel_translateX, currentYOffset)}rem)`;
                }

                break;

            case 2:
                //console.log('2 play');

                if (scrollRatio > 0.01){
                    objs.yellowPanel.style.transform = `rotate(${calcValues(values.yellowPanel_rotate, currentYOffset)}deg) translateX(${calcValues(values.yellowPanel_translateX, currentYOffset)}rem)`;
                }

                break;

            case 3:
                //console.log('3 play');

                if (scrollRatio > 0.01){
                    objs.yellowPanel.style.transform = `rotate(${calcValues(values.yellowPanel_rotate, currentYOffset)}deg) translateX(${calcValues(values.yellowPanel_translateX, currentYOffset)}rem)`;
                }

                break;

            case 4:
                //console.log('4 play');
                break;

            case 5:
                //console.log('5 play');
                break;

            case 6:
                //console.log('6 play');
                break;
        }

    }

    function scrollLoop(){
        //스크롤 되며 작동 되어야 할 일들
        //현재 몇번째 섹션이 스크롤중인지 판별

        enterNewScene = false; //새로운 scene이 시작되는 순간 true
		prevScrollHeight = 0; //스크롤 할 때 마다 값이 누적되는것 방지 위해 초기화

        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
            //이전 씬의 스크롤 높이
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
            //'현재 스크롤 된 높이값'이 '이전 씬의 스크롤 높이 + 현재 씬의 스크롤 높이' 보다 커지면
            //'현재 씬의 번호'를 하나씩 올린 후 body에 id 넣어줌
        }

        if (yOffset < prevScrollHeight){
            enterNewScene = true;
            if (currentScene === 0) return;
            //페이지 스크롤 중에 바운스 효과가 나오면 사파리는 -처리를 하게 되는 것을 보완
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
            //'현재 스크롤 된 높이값'이 '이전 씬의 스크롤 높이'보다 작아지면
            //'현재 씬의 번호'를 하나씩 내린 후 body에 id 넣어줌
        }

        if (enterNewScene) return; //스크롤 하면서 scene이 바뀌는 순간에 이상한 값이 들어가는 버그 대응

        playAnimation();

        console.log(currentScene);

        if(currentScene === 0){
            sceneInfo[0].objs.cyberBtn.style.display = 'block';
            sceneInfo[0].objs.titleLogo.style.display = 'block';
        }else{
            sceneInfo[0].objs.cyberBtn.style.display = 'none';
            sceneInfo[0].objs.titleLogo.style.display = 'none';
        }

    }

    //더 부드러운 애니메이션
    function loop(){
        delayedYOffset = delayedYOffset + ( yOffset - delayedYOffset ) * acc;

        if (!enterNewScene){
            if(currentScene === 0){
                const currentYOffset = delayedYOffset - prevScrollHeight; //현재 씬에서 스크롤 된 양
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if (objs.videoImages[sequence]) {
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }

        rafId = requestAnimationFrame(loop);
        
        if (Math.abs(yOffset - delayedYOffset) < 1){
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }


    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        //로드되자마자 스크롤 전에 캔버스 첫번째 이미지 그리기        

        window.addEventListener('scroll' , () => {
            yOffset = window.scrollY;
            scrollLoop();
    
            if ( !rafState){
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize' , () => { //브라우저 사이즈 바뀜에 대응

            if (window.innerWidth > 600){ //모바일은 리사이즈 될 일이 없으므로 모바일 제외
                setLayout();
            }
            
        }); 

        window.addEventListener('orientationchange', setLayout); //모바일 가로모드, 세로모드 변경될때 
        document.querySelector('.loading').addEventListener('transitionend', (e) =>{
            document.body.removeChild(e.currentTarget);
        });

    });

    setCanvasImages();

})();
