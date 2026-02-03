document.addEventListener('DOMContentLoaded', function() {
    // Элементы экранов
    const screens = {
        start: document.getElementById('start-screen'),
        question: document.getElementById('question-screen'),
        final: document.getElementById('final-screen'),
        happy: document.getElementById('happy-ending'),
        sad: document.getElementById('sad-ending')
    };

    // Кнопки
    const startYesBtn = document.getElementById('start-yes');
    const startNoBtn = document.getElementById('start-no');
    const questionYesBtn = document.getElementById('question-yes');
    const questionNoBtn = document.getElementById('question-no');
    const finalYesBtn = document.getElementById('final-yes');
    const finalNoBtn = document.getElementById('final-no');

    // Другие элементы
    const questionText = document.getElementById('question-text');
    const heartImage = document.getElementById('heart-image');
    const progressFill = document.querySelector('.progress-fill');
    const photoGrid = document.getElementById('photo-grid');
    const finalHeart = document.getElementById('final-heart');

    // Вопросы и фотографии
    const questions = [
        { text: "Мы?", image: "./images/img0.png" },
        { text: "Мы?", image: "./images/img1.png" },
        { text: "Мы?", image: "./images/img2.png" },
        { text: "Мы?", image: "./images/img4.png" },
        { text: "Мы?", image: "./images/img5.png" },
        { text: "Мы?", image: "./images/img6.png" },
        { text: "Мы?", image: "./images/img7.png" },
        { text: "Мы?", image: "./images/img8.png" },
        { text: "Мы?", image: "./images/img9.png" },
        { text: "Мы?", image: "./images/img10.png" },
        { text: "Мы?", image: "./images/img11.png" },
        { text: "Мы?", image: "./images/img12.png" }
    ];

    // Фотографии для счастливого финала (9 новых фото)
    const happyEndingPhotos = [
        "./images/img.png",
        "./images/img_1.png",
        "./images/img_2.png",
        "./images/img_3.png",
        "./images/img_4.png",
        "./images/img_5.png",
        "./images/img_6.png",
        "./images/img_7.png",
        "./images/img_8.png"
    ];

    // Текущее состояние
    let currentQuestion = 0;
    let isNoButtonEscaping = true;
    let escapeInterval = null;
    let mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let finalNoHoverTimer = null;
    let isFinalNoHovered = false;

    // Инициализация
    function init() {
        showScreen('start');
        createParticles();
        setupButtons();
        document.addEventListener('mousemove', (e) => {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        });
        preloadImages();
    }

    // Предзагрузка изображений
    function preloadImages() {
        const allImages = [...questions.map(q => q.image), ...happyEndingPhotos];
        allImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Создание частиц фона
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background-color: rgba(255, 182, 193, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
            `;

            const keyframes = `
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(${Math.random() * 100 - 50}vh) translateX(${Math.random() * 100 - 50}vw); }
                }
            `;

            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);

            particlesContainer.appendChild(particle);
        }
    }

    // Запуск убегания кнопки при наведении мыши
    function startNoButtonEscape(button) {
        if (!button || !isNoButtonEscaping) return;

        if (escapeInterval) {
            clearInterval(escapeInterval);
            escapeInterval = null;
        }

        const checkMouseProximity = () => {
            if (!button || !document.body.contains(button)) {
                clearInterval(escapeInterval);
                return;
            }

            if (!button.closest('.screen.active')) {
                return;
            }

            const buttonRect = button.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(mousePosition.x - buttonCenterX, 2) +
                Math.pow(mousePosition.y - buttonCenterY, 2)
            );

            const escapeDistance = 80;

            if (distance < escapeDistance) {
                // ДЛЯ ФИНАЛЬНОЙ КНОПКИ - не убегаем сразу
                if (button.id === 'final-no') {
                    return;
                } else {
                    escapeToRandomPosition(button);
                }
            }
        };

        checkMouseProximity();
        escapeInterval = setInterval(checkMouseProximity, 50);
    }

    // Отдельная функция для обработки наведения на финальную кнопку с задержкой
    function setupFinalNoHover() {
        if (!finalNoBtn) return;

        // Удаляем старые обработчики
        finalNoBtn.removeEventListener('mouseenter', handleFinalNoMouseEnter);
        finalNoBtn.removeEventListener('mouseleave', handleFinalNoMouseLeave);

        // Обработчик при наведении - с задержкой 800мс
        function handleFinalNoMouseEnter() {
            isFinalNoHovered = true;

            // Запускаем таймер на 800мс (0.8 секунды)
            finalNoHoverTimer = setTimeout(() => {
                if (isFinalNoHovered && isNoButtonEscaping) {
                    escapeToRandomPosition(finalNoBtn);
                }
            }, 200);
        }

        // Обработчик при уходе мыши
        function handleFinalNoMouseLeave() {
            isFinalNoHovered = false;
            if (finalNoHoverTimer) {
                clearTimeout(finalNoHoverTimer);
                finalNoHoverTimer = null;
            }
        }

        // Добавляем обработчики
        finalNoBtn.addEventListener('mouseenter', handleFinalNoMouseEnter);
        finalNoBtn.addEventListener('mouseleave', handleFinalNoMouseLeave);

        // Гарантируем что кнопка кликабельна
        finalNoBtn.style.pointerEvents = 'auto';
        finalNoBtn.style.cursor = 'pointer';
    }

    // Убегание в случайную позицию
    function escapeToRandomPosition(button) {
        if (!button) return;

        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;
        const maxX = window.innerWidth - buttonWidth - 20;
        const maxY = window.innerHeight - buttonHeight - 20;

        let bestX = 20;
        let bestY = 20;
        let maxDistance = 0;

        for (let i = 0; i < 8; i++) {
            const testX = Math.max(20, Math.min(maxX, Math.random() * maxX));
            const testY = Math.max(20, Math.min(maxY, Math.random() * maxY));

            const distance = Math.sqrt(
                Math.pow(mousePosition.x - testX, 2) +
                Math.pow(mousePosition.y - testY, 2)
            );

            if (distance > maxDistance) {
                maxDistance = distance;
                bestX = testX;
                bestY = testY;
            }
        }

        button.classList.add('escaping');
        button.style.position = 'fixed';
        button.style.left = `${bestX}px`;
        button.style.top = `${bestY}px`;
        button.style.zIndex = '1000';
        button.style.transition = `left 0.3s, top 0.3s`;
    }

    // ВОЗВРАТ КНОПКИ "НЕТ" НА МЕСТО
    function resetNoButtonToInitialPosition(button) {
        if (!button) return;

        button.classList.remove('escaping');
        button.style.position = 'absolute';
        button.style.zIndex = '10';
        button.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

        const buttonGroup = button.closest('.button-group');
        if (buttonGroup) {
            const yesButton = buttonGroup.querySelector('.btn-yes');

            if (yesButton) {
                const groupRect = buttonGroup.getBoundingClientRect();
                const yesRect = yesButton.getBoundingClientRect();

                const leftPosition = yesRect.right - groupRect.left + 30;
                const topPosition = yesRect.top - groupRect.top + 15;

                button.style.left = `${leftPosition}px`;
                button.style.top = `${topPosition}px`;
            }
        }
    }

    // Настройка обработчиков кнопок
    function setupButtons() {
        // Стартовый экран
        startYesBtn.addEventListener('click', () => {
            playSound('heartbeat');
            resetNoButtonToInitialPosition(startNoBtn);

            setTimeout(() => {
                unfoldHeart('main-heart', () => {
                    currentQuestion = 0;
                    loadQuestion(currentQuestion);
                    showScreen('question');

                    setTimeout(() => {
                        unfoldHeart('question-heart');
                        resetNoButtonToInitialPosition(questionNoBtn);
                        startNoButtonEscape(questionNoBtn);
                    }, 300);
                });
            }, 500);
        });

        // Кнопки "нет" - убегают при наведении (кроме финальной)
        [startNoBtn, questionNoBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', () => {
                    if (isNoButtonEscaping) {
                        escapeToRandomPosition(btn);
                    }
                });
            }
        });

        // Экран с вопросами
        questionYesBtn.addEventListener('click', () => {
            playSound('heartbeat');
            resetNoButtonToInitialPosition(questionNoBtn);

            foldHeart('question-heart', () => {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    loadQuestion(currentQuestion);

                    setTimeout(() => {
                        unfoldHeart('question-heart');
                        setTimeout(() => {
                            resetNoButtonToInitialPosition(questionNoBtn);
                            startNoButtonEscape(questionNoBtn);
                        }, 100);
                    }, 300);
                } else {
                    // Переходим на финальный экран
                    setTimeout(() => {
                        showScreen('final');
                        // Настраиваем финальный экран
                        setupFinalScreen();
                    }, 500);
                }
            });
        });

        // ФИНАЛЬНАЯ кнопка "нет" - РАБОЧАЯ с задержкой
//        if (finalNoBtn) {
//            // Очищаем старые обработчики
//            finalNoBtn.onclick = null;
//
//            // Добавляем новый обработчик клика
//            finalNoBtn.addEventListener('click', function(event) {
//                event.stopPropagation();
//
//                // Останавливаем все таймеры
//                if (finalNoHoverTimer) {
//                    clearTimeout(finalNoHoverTimer);
//                    finalNoHoverTimer = null;
//                }
//                isFinalNoHovered = false;
//
//                // Останавливаем убегание
//                isNoButtonEscaping = false;
//                if (escapeInterval) {
//                    clearInterval(escapeInterval);
//                    escapeInterval = null;
//                }
//
//                // Возвращаем кнопку на место
//                resetNoButtonToInitialPosition(finalNoBtn);
//
//                // Показываем грустный финал
//                setTimeout(() => {
//                    showSadEnding();
//                }, 300);
//            });
//        }

        // ФИНАЛЬНАЯ кнопка "да" - ведет на счастливый финал
        if (finalYesBtn) {
            finalYesBtn.addEventListener('click', () => {
                // Останавливаем таймеры финальной кнопки
                if (finalNoHoverTimer) {
                    clearTimeout(finalNoHoverTimer);
                    finalNoHoverTimer = null;
                }
                isFinalNoHovered = false;

                isNoButtonEscaping = false;
                if (escapeInterval) {
                    clearInterval(escapeInterval);
                    escapeInterval = null;
                }

                // Показываем счастливый финал
                showHappyEnding();
            });
        }


    }

    // Настройка финального экрана
    function setupFinalScreen() {
        if (!finalHeart) return;

        // 1. Скрываем содержимое сердца (если оно видимо)
        const heartContent = finalHeart.querySelector('.heart-content');
        if (heartContent) {
            heartContent.style.display = 'none';
        }

        // 2. Гарантируем что сердце закрыто
        finalHeart.classList.remove('unfolded');
        finalHeart.classList.add('folded');

        // 3. Убираем возможность открытия
        const heartFront = finalHeart.querySelector('.heart-front');
        if (heartFront) {
            heartFront.style.transform = 'rotateY(0deg)';
            heartFront.style.zIndex = '3';
        }

        // 4. Устанавливаем финальный вопрос (создаем новый элемент, если его нет)
        let questionElement = document.querySelector('#final-screen .question');
        if (!questionElement) {
            questionElement = document.createElement('h1');
            questionElement.className = 'question';
            questionElement.id = 'final-question';
            questionElement.style.opacity = '0';
            questionElement.style.transform = 'translateY(20px)';
            questionElement.style.transition = 'opacity 1s ease, transform 1s ease';

            // Вставляем после heart-wrapper
            const heartWrapper = document.querySelector('#final-screen .heart-wrapper');
            if (heartWrapper) {
                const buttonGroup = document.querySelector('#final-screen .button-group');
                if (buttonGroup) {
                    heartWrapper.parentNode.insertBefore(questionElement, buttonGroup);
                } else {
                    heartWrapper.parentNode.appendChild(questionElement);
                }
            }
        }

        // Устанавливаем текст вопроса
        questionElement.textContent = "";

        // 5. Скрываем прогресс-бар
        const progressBar = document.querySelector('#final-screen .progress');
        if (progressBar) {
            progressBar.style.display = 'none';
        }

        // 6. Настраиваем финальную кнопку "нет" с задержкой 800мс
        setTimeout(() => {
            // Возвращаем кнопку на место
            resetNoButtonToInitialPosition(finalNoBtn);

            // Включаем специальную обработку наведения с задержкой
            setupFinalNoHover();

            // Запускаем обычную проверку (но она не будет убегать для финальной кнопки)
            startNoButtonEscape(finalNoBtn);
        }, 300);

        // 7. Запускаем эффекты
        setTimeout(() => {
            startFinalEffects();
            playSound('sparkle');
        }, 300);
    }

    // Запуск финальных эффектов
    function startFinalEffects() {
        if (!finalHeart) return;

        // 1. Сначала показываем финальный вопрос
        showFinalQuestion();

        // 2. Через 0.5 сек запускаем свечение
        setTimeout(() => {
            finalHeart.classList.add('glowing');

            // Постепенное усиление свечения
            const heartBase = finalHeart.querySelector('.heart-base');
            const heartFront = finalHeart.querySelector('.heart-front');

            if (heartBase && heartFront) {
                let intensity = 0;
                const glowInterval = setInterval(() => {
                    intensity += 0.1;
                    const glowValue = intensity * 25;

                    heartBase.style.boxShadow =
                        `0 0 ${glowValue}px rgba(255, 77, 121, ${0.5 + intensity * 0.3})`;

                    heartFront.style.boxShadow =
                        `inset 0 0 ${glowValue * 0.5}px rgba(255, 255, 255, ${intensity * 0.4}),
                         0 0 ${glowValue}px rgba(255, 77, 121, ${0.5 + intensity * 0.3})`;

                    if (intensity >= 1) {
                        clearInterval(glowInterval);
                    }
                }, 100);
            }
        }, 500);

        // 3. Через 1 сек добавляем звездочки
        setTimeout(() => {
            addStarsWithDelay();
        }, 1000);

        // 4. Через 1.5 сек пульсация сердца
        setTimeout(() => {
            startHeartPulse();
        }, 1500);

        // 5. Через 2 сек плавающие сердечки
        setTimeout(() => {
            addFloatingHearts();
        }, 2000);
    }

    // Показ финального вопроса
    function showFinalQuestion() {
        const questionElement = document.querySelector('#final-screen .question');
        if (!questionElement) return;

        // Текст вопроса
        const questionText = "Андрей, ты примешь от меня эту валентинку?";

        // Плавное появление блока
        setTimeout(() => {
            questionElement.style.opacity = '1';
            questionElement.style.transform = 'translateY(0)';

            // Печатаем текст по буквам
            typeText(questionElement, questionText, 0, 40);
        }, 100);
    }

    // Плавный набор текста
    function typeText(element, text, index, speed) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeText(element, text, index + 1, speed), speed);
        }
    }

    // Добавление звездочек с задержкой
    function addStarsWithDelay() {
        const heartWrapper = document.querySelector('#final-screen .heart-wrapper');
        if (!heartWrapper) return;

        // Используем существующие звездочки из HTML
        const existingStars = heartWrapper.querySelectorAll('.star');
        existingStars.forEach((star, index) => {
            star.style.opacity = '0';
            star.style.transform = 'scale(0)';
            star.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';

            // Появляются с задержкой
            setTimeout(() => {
                star.style.opacity = '1';
                star.style.transform = 'scale(1.2)';

                // Мерцание после появления
                setTimeout(() => {
                    star.style.animation = `starTwinkle ${Math.random() * 2 + 1.5}s infinite ${Math.random() * 2}s`;
                }, 500);
            }, index * 300);
        });

        // Добавляем CSS для мерцания если еще нет
        if (!document.querySelector('#star-twinkle-style')) {
            const style = document.createElement('style');
            style.id = 'star-twinkle-style';
            style.textContent = `
                @keyframes starTwinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Пульсация сердца
    function startHeartPulse() {
        if (!finalHeart) return;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes gentlePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.03); }
                100% { transform: scale(1); }
            }
            #final-heart {
                animation: gentlePulse 3s infinite ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    // Добавление плавающих сердечек
    function addFloatingHearts() {
        const container = document.querySelector('#final-screen .container');
        if (!container) return;

        // Создаем плавающие сердечки
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 15 + 10}px;
                color: rgba(255, 105, 180, ${Math.random() * 0.4 + 0.2});
                opacity: 0;
                z-index: 1;
                pointer-events: none;
                filter: drop-shadow(0 0 3px rgba(255, 105, 180, 0.5));
            `;

            // Начальная позиция
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            heart.style.left = `${startX}%`;
            heart.style.top = `${startY}%`;

            // Анимация плавания
            const animationName = `floatAnimation${i}`;
            const duration = Math.random() * 15 + 10;
            const keyframes = `
                @keyframes ${animationName} {
                    0% {
                        transform: translate(-50%, -50%) translate(0, 0) rotate(0deg);
                        opacity: 0;
                    }
                    10% { opacity: ${Math.random() * 0.5 + 0.2}; }
                    90% { opacity: ${Math.random() * 0.3 + 0.1}; }
                    100% {
                        transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;

            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);

            heart.style.animation = `${animationName} ${duration}s linear infinite ${Math.random() * 5}s`;

            container.appendChild(heart);

            // Плавное появление
            setTimeout(() => {
                heart.style.opacity = '1';
                heart.style.transition = 'opacity 1s ease';
            }, 300);
        }
    }

    // Показать экран
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });

        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        }
    }

    // Загрузка вопроса
    function loadQuestion(index) {
        if (index < questions.length) {
            const question = questions[index];
            questionText.textContent = question.text;
            heartImage.src = question.image;
            heartImage.alt = "Наше воспоминание";

            const progressPercent = ((index + 1) / questions.length) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
    }

    // Анимация раскрытия сердца
    function unfoldHeart(heartId, callback) {
        const heartElement = document.getElementById(heartId);
        if (!heartElement) return;

        heartElement.classList.remove('folded');

        setTimeout(() => {
            heartElement.classList.add('unfolded');
            playSound('heartbeat');

            if (callback) {
                setTimeout(callback, 1500);
            }
        }, 100);
    }

    // Анимация закрытия сердца
    function foldHeart(heartId, callback) {
        const heartElement = document.getElementById(heartId);
        if (!heartElement) return;

        heartElement.classList.remove('unfolded');

        setTimeout(() => {
            heartElement.classList.add('folded');

            if (callback) {
                setTimeout(callback, 1200);
            }
        }, 100);
    }

    // Анимация выброса сердца в мусорку
    function throwHeartToTrash(heartId) {
    const heartElement = document.getElementById(heartId);
    if (!heartElement) return;

    const trashLid = document.querySelector('.bin-lid');

    // 1. Сначала убедимся что крышка открыта
    if (trashLid) {
        trashLid.style.transform = 'rotate(-45deg)';
    }

    // 2. Небольшая задержка для уверенности
    setTimeout(() => {
        // 3. Запускаем анимацию выброса сердца
        heartElement.style.animation = 'throwHeart 2s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        // 4. После падения сердца - закрываем крышку
        setTimeout(() => {
            if (trashLid) {
                trashLid.style.transform = 'rotate(0deg)';
            }

            // 5. После закрытия можно добавить звук или эффект
            setTimeout(() => {
                playSound('heartbeat'); // Или другой звук
            }, 500);

        }, 1800); // Закрываем через 1.8 секунды (после падения)
    }, 100);
}

    // Показать счастливый финал
    function showHappyEnding() {
    // Останавливаем все эффекты финального экрана
    if (finalHeart) {
        finalHeart.classList.remove('glowing');
        finalHeart.style.animation = '';
    }

    // Показываем экран счастливого финала
    showScreen('happy');

    // Сначала скрываем надпись
    const happyTitle = document.querySelector('#happy-ending h1');
    if (happyTitle) {
        happyTitle.style.opacity = '0';
        happyTitle.style.visibility = 'hidden';
        happyTitle.style.transform = 'translateY(20px)';
        happyTitle.style.transition = 'opacity 0s, visibility 0s, transform 0s';
    }

    // Заполняем фото-грид новыми 9 фото
    if (photoGrid) {
        photoGrid.innerHTML = '';

        // Счетчик загруженных фото
        let loadedPhotos = 0;
        const totalPhotos = happyEndingPhotos.length;

        // Проверяем наличие фотографий
        console.log(happyEndingPhotos);

        // Добавляем сообщение на случай если фото не загрузились
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        loadingMessage.style.cssText = `
            text-align: center;
            color: #666;
            font-style: italic;
            margin: 20px;
            opacity: 0.7;
            font-size: 1.2rem;
            grid-column: 1 / -1;
        `;
        photoGrid.appendChild(loadingMessage);

        // Функция проверки загрузки всех фото
        function checkAllPhotosLoaded() {
            loadedPhotos++;
            console.log(`Загружено фото: ${loadedPhotos} из ${totalPhotos}`);

            if (loadedPhotos === totalPhotos) {
                // Показываем надпись через 500мс после загрузки последнего фото
                setTimeout(showTitleWithAnimation, 500);
            }
        }

        // Функция показа надписи с анимацией
        function showTitleWithAnimation() {
            if (happyTitle) {
                happyTitle.style.transition = 'opacity 1s ease, transform 1s ease, visibility 1s ease';
                happyTitle.style.visibility = 'visible';

                setTimeout(() => {
                    happyTitle.style.opacity = '1';
                    happyTitle.style.transform = 'translateY(0)';

                    // Добавляем анимацию пульсации
                    happyTitle.style.animation = 'lovePulse 2s infinite ease-in-out';

                    // Добавляем CSS для анимации пульсации
                    if (!document.querySelector('#love-pulse-animation')) {
                        const style = document.createElement('style');
                        style.id = 'love-pulse-animation';
                        style.textContent = `
                            @keyframes lovePulse {
                                0%, 100% {
                                    transform: translateY(0) scale(1);
                                    text-shadow: 0 2px 10px rgba(255, 64, 129, 0.3);
                                }
                                50% {
                                    transform: translateY(-5px) scale(1.05);
                                    text-shadow: 0 5px 20px rgba(255, 64, 129, 0.5);
                                }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }, 100);
            }
        }

        // Загружаем 9 новых фото
        happyEndingPhotos.forEach((photoSrc, index) => {
            setTimeout(() => {
                const img = document.createElement('img');
                img.src = photoSrc;
                img.alt = `Наше фото ${index + 1}`;
                img.style.opacity = '0';
                img.style.transform = 'scale(0.8)';
                img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                // Обработчик ошибки загрузки
                img.onerror = function() {
                    console.error(`Ошибка загрузки изображения: ${photoSrc}`);
                    this.style.border = '2px dashed #ff4081';
                    this.style.padding = '10px';
                    this.style.boxSizing = 'border-box';

                    const errorText = document.createElement('div');
                    errorText.textContent = `Фото ${index + 1}`;
                    errorText.style.cssText = `
                        color: #ff4081;
                        text-align: center;
                        font-size: 14px;
                        margin-top: 5px;
                    `;

                    const container = document.createElement('div');
                    container.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255, 64, 129, 0.1);
                        border-radius: 10px;
                        padding: 20px;
                        min-height: 150px;
                    `;

                    const heartIcon = document.createElement('div');
                    heartIcon.innerHTML = '❤️';
                    heartIcon.style.fontSize = '40px';
                    heartIcon.style.marginBottom = '10px';

                    container.appendChild(heartIcon);
                    container.appendChild(errorText);

                    photoGrid.replaceChild(container, img);

                    setTimeout(() => {
                        container.style.opacity = '1';
                        container.style.transform = 'scale(1)';
                    }, 100);

                    // Все равно считаем фото как загруженное (даже с ошибкой)
                    checkAllPhotosLoaded();
                };

                // Обработчик успешной загрузки
                img.onload = function() {
                    console.log(`Успешно загружено фото: ${photoSrc}`);
                    checkAllPhotosLoaded();
                };

                photoGrid.appendChild(img);

                // Удаляем сообщение о загрузке после первого фото
                if (index === 0 && loadingMessage.parentNode) {
                    setTimeout(() => {
                        loadingMessage.style.opacity = '0';
                        loadingMessage.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            if (loadingMessage.parentNode) {
                                photoGrid.removeChild(loadingMessage);
                            }
                        }, 300);
                    }, 300);
                }

                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 100);
            }, index * 150);
        });

        // На всякий случай: если все фото уже загружены из кэша или что-то пошло не так
        // Показываем надпись через максимальное время (9 фото * 150мс + 2000мс запас)
        const maxWaitTime = happyEndingPhotos.length * 150 + 2000;
        setTimeout(() => {
            if (happyTitle && happyTitle.style.visibility !== 'visible') {
                console.log('Показываем надпись по таймауту (максимальное время ожидания)');
                showTitleWithAnimation();
            }
        }, maxWaitTime);
    }

    playSound('sparkle');

    // Добавляем падающие сердечки сразу
    createFallingHearts();
}


    // Создание падающих сердечек для счастливого финала
    function createFallingHearts() {
        const heartsContainer = document.querySelector('.hearts-fall');
        if (!heartsContainer) return;

        // Очищаем старые сердечки
        heartsContainer.innerHTML = '';

        // Создаем больше сердечек
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('i');
            heart.className = 'falling-heart fa-solid fa-heart';
            heart.style.cssText = `
                position: absolute;
                color: #ff4081;
                font-size: ${Math.random() * 20 + 15}px;
                opacity: ${Math.random() * 0.6 + 0.4};
                left: ${Math.random() * 120 - 10}%;
                animation: fall ${Math.random() * 3 + 2}s linear infinite ${Math.random() * 2}s;
                filter: drop-shadow(0 0 5px rgba(255, 64, 129, 0.5));
            `;

            heartsContainer.appendChild(heart);
        }
    }

    // Показать грустный финал
    // Показать грустный финал - ИСПРАВЛЕННАЯ ВЕРСИЯ
function showSadEnding() {
    // 1. НЕМЕДЛЕННО меняем экраны
    showScreen('sad');

    // 2. Останавливаем ВСЕ анимации на предыдущем экране
    const finalHeart = document.getElementById('final-heart');
    if (finalHeart) {
        finalHeart.style.animation = 'none !important';
        finalHeart.style.transition = 'none !important';
        finalHeart.classList.remove('glowing', 'unfolded');
        finalHeart.style.opacity = '0';
        finalHeart.style.visibility = 'hidden';
    }

    // 3. Сбрасываем финальный вопрос
    const finalQuestion = document.getElementById('final-question');
    if (finalQuestion) {
        finalQuestion.style.opacity = '0';
        finalQuestion.style.visibility = 'hidden';
    }

    // 4. Останавливаем ВСЕ интервалы и таймеры СРАЗУ
    isNoButtonEscaping = false;
    if (escapeInterval) {
        clearInterval(escapeInterval);
        escapeInterval = null;
    }

    if (finalNoHoverTimer) {
        clearTimeout(finalNoHoverTimer);
        finalNoHoverTimer = null;
    }
    isFinalNoHovered = false;

    // 5. Принудительно сбрасываем все CSS анимации на body
    document.body.style.animation = 'none';
    document.body.style.transition = 'none';

    // 6. Очищаем анимации звездочек и сердечек
    document.querySelectorAll('.star, .floating-heart, .heart').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });

    // 7. Подготавливаем сцену мусорки
    const trashLid = document.querySelector('.bin-lid');
    const trashedHeart = document.getElementById('trashed-heart');

    // 8. Подготавливаем сердце для выброса
    if (trashedHeart) {
        // Сначала полностью сбрасываем стили
        trashedHeart.style.cssText = '';
        trashedHeart.className = '';

        // Создаем новую структуру сердца
        trashedHeart.innerHTML = `
            <div class="heart-container">
                <div class="heart-base"></div>
                <div class="heart-front"></div>
            </div>
        `;

        // Устанавливаем начальные стили
        trashedHeart.style.position = 'absolute';
        trashedHeart.style.left = '50%';
        trashedHeart.style.top = '0';
        trashedHeart.style.width = '100px';
        trashedHeart.style.height = '100px';
        trashedHeart.style.marginLeft = '-50px';
        trashedHeart.style.opacity = '1';
        trashedHeart.style.zIndex = '10';
        trashedHeart.style.display = 'block';
        trashedHeart.style.transform = 'none';
        trashedHeart.style.animation = 'none';

        // Принудительный reflow
        void trashedHeart.offsetWidth;
    }

    // 9. Открываем крышку мусорки
    if (trashLid) {
        trashLid.style.transition = 'none';
        trashLid.style.transform = 'rotate(-45deg)';
    }

    // 10. Небольшая задержка для стабилизации DOM
    setTimeout(() => {
        // Запускаем анимацию выброса
        if (trashedHeart) {
            trashedHeart.style.animation = 'throwHeart 2s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            // Закрываем крышку после падения
            setTimeout(() => {
                if (trashLid) {
                    trashLid.style.transition = 'transform 0.5s ease-in-out';
                    trashLid.style.transform = 'rotate(0deg)';
                }
            }, 1800);
        }

        // 11. Показываем текст
        const endingText = document.querySelector('#sad-ending .ending-text');
        if (endingText) {
//            endingText.style.opacity = '0';
            setTimeout(() => {
                endingText.style.transition = 'opacity 1s ease';
//                endingText.style.opacity = '1';
            }, 2200);
        }
    }, 50);
}

// Также обновите обработчик кнопки "Нет" на финальном экране:
if (finalNoBtn) {
    finalNoBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        // НЕМЕДЛЕННАЯ остановка всего
        if (finalNoHoverTimer) {
            clearTimeout(finalNoHoverTimer);
            finalNoHoverTimer = null;
        }

        isNoButtonEscaping = false;
        if (escapeInterval) {
            clearInterval(escapeInterval);
            escapeInterval = null;
        }

        // НЕМЕДЛЕННЫЙ переход
        showSadEnding();

        return false;
    });
}

    // Сброс приложения
    function resetApp() {
        currentQuestion = 0;
        isNoButtonEscaping = true;
        isFinalNoHovered = false;

        // Очищаем таймеры финальной кнопки
        if (finalNoHoverTimer) {
            clearTimeout(finalNoHoverTimer);
            finalNoHoverTimer = null;
        }

        if (escapeInterval) {
            clearInterval(escapeInterval);
            escapeInterval = null;
        }

        const heartIds = ['main-heart', 'question-heart', 'final-heart'];
        heartIds.forEach(heartId => {
            const heart = document.getElementById(heartId);
            if (heart) {
                heart.classList.add('folded');
                heart.classList.remove('unfolded', 'glowing');
                heart.style.animation = '';

                // Восстанавливаем содержимое сердца
                const heartContent = heart.querySelector('.heart-content');
                if (heartContent) {
                    heartContent.style.display = 'flex';
                    heartContent.style.opacity = '1';
                    heartContent.style.visibility = 'visible';
                    heartContent.style.overflow = 'hidden';
                }

                // Сбрасываем тени
                const heartBase = heart.querySelector('.heart-base');
                const heartFront = heart.querySelector('.heart-front');
                if (heartBase && heartFront) {
                    heartBase.style.boxShadow = '';
                    heartFront.style.boxShadow = '';
                }
            }
        });

        progressFill.style.width = '0%';

        const trashLid = document.querySelector('.bin-lid');
        if (trashLid) {
            trashLid.style.transform = '';
        }

        const noButtons = [startNoBtn, questionNoBtn, finalNoBtn];
        noButtons.forEach(button => {
            if (button) {
                resetNoButtonToInitialPosition(button);
            }
        });

        // Удаляем созданный вопрос на финальном экране
        const finalQuestionElement = document.getElementById('final-question');
        if (finalQuestionElement) {
            finalQuestionElement.remove();
        }

        // Удаляем созданные элементы
        const elementsToRemove = [
            '.floating-heart'
        ];

        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        // Восстанавливаем прогресс-бар
        const progressBar = document.querySelector('#final-screen .progress');
        if (progressBar) {
            progressBar.style.display = 'block';
        }

        // Сбрасываем звездочки
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.opacity = '0';
            star.style.animation = 'none';
            star.style.transform = 'scale(1)';
        });

        // Удаляем добавленные стили
        const addedStyles = document.querySelectorAll('style[data-added="true"]');
        addedStyles.forEach(style => style.remove());

        // Удаляем стиль пульсации
        const pulseStyle = document.querySelector('style:contains("gentlePulse")');
        if (pulseStyle) {
            pulseStyle.remove();
        }

        // Удаляем стиль мерцания звезд
        const starStyle = document.querySelector('#star-twinkle-style');
        if (starStyle) {
            starStyle.remove();
        }
    }

    // Воспроизведение звуков
    function playSound(type) {
        try {
            if (type === 'heartbeat') {
                const sound = document.getElementById('heartbeat-sound');
                if (sound) {
                    sound.currentTime = 0;
                    sound.play().catch(e => console.log("Автовоспроизведение звука заблокировано"));
                }
            } else if (type === 'sparkle') {
                const sound = document.getElementById('sparkle-sound');
                if (sound) {
                    sound.currentTime = 0;
                    sound.play().catch(e => console.log("Автовоспроизведение звука заблокировано"));
                }
            }
        } catch (e) {
            console.log("Ошибка воспроизведения звука:", e);
        }
    }

    // Запуск приложения
    init();
});