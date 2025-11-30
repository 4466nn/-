        document.addEventListener('DOMContentLoaded', function() {
            const display = document.querySelector('.display-content');
            const buttons = document.querySelectorAll('.btn');
            const lightField = document.getElementById('lightField');
            const moreOptions = document.getElementById('moreOptions');
            const colorPanel = document.getElementById('colorPanel');
            const overlay = document.getElementById('overlay');
            const closePanel = document.getElementById('closePanel');
            const colorOptions = document.querySelectorAll('.color-option');
            
            let currentInput = '0';
            let previousInput = '';
            let operation = null;
            let resetScreen = false;
            let glowColor = '#ffcc00'; // 默认金色光效
            
            // 更新显示屏
            function updateDisplay() {
                display.textContent = currentInput;
            }
            
            // 创建光点
            function createLightSpot(x, y) {
                const lightSpot = document.createElement('div');
                lightSpot.className = 'light-spot';
                lightSpot.style.left = `${x}px`;
                lightSpot.style.top = `${y}px`;
                lightSpot.style.background = `radial-gradient(circle, ${glowColor}40 0%, rgba(255, 255, 255, 0) 70%)`;
                lightField.appendChild(lightSpot);
                
                // 显示光场效果
                lightField.style.opacity = '1';
                
                // 移除光点
                setTimeout(() => {
                    lightSpot.remove();
                    if (lightField.children.length === 0) {
                        lightField.style.opacity = '0';
                    }
                }, 600);
            }
            
            // 添加按钮光效
            function addButtonGlow(button, adjacentButtons = []) {
                // 设置CSS变量
                document.documentElement.style.setProperty('--glow-color', `${glowColor}66`);
                
                // 清除所有光效
                buttons.forEach(btn => {
                    btn.classList.remove('btn-glow', 'adjacent-glow');
                });
                
                // 为当前按钮添加光效
                button.classList.add('btn-glow');
                
                // 为相邻按钮添加光效
                adjacentButtons.forEach(adjacentBtn => {
                    if (adjacentBtn) {
                        adjacentBtn.classList.add('adjacent-glow');
                    }
                });
                
                // 移除光效
                setTimeout(() => {
                    button.classList.remove('btn-glow');
                    adjacentButtons.forEach(adjacentBtn => {
                        if (adjacentBtn) {
                            adjacentBtn.classList.remove('adjacent-glow');
                        }
                    });
                }, 300);
            }
            
            // 获取相邻按钮
            function getAdjacentButtons(button) {
                const adjacentButtons = [];
                const buttonIndex = Array.from(buttons).indexOf(button);
                
                // 获取上方按钮
                if (buttonIndex >= 4) adjacentButtons.push(buttons[buttonIndex - 4]);
                
                // 获取下方按钮
                if (buttonIndex < buttons.length - 4) adjacentButtons.push(buttons[buttonIndex + 4]);
                
                // 获取左侧按钮
                if (buttonIndex % 4 !== 0) adjacentButtons.push(buttons[buttonIndex - 1]);
                
                // 获取右侧按钮
                if (buttonIndex % 4 !== 3) adjacentButtons.push(buttons[buttonIndex + 1]);
                
                return adjacentButtons;
            }
            
            // 添加按钮点击事件
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // 获取按钮位置
                    const rect = button.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    
                    // 创建光点
                    createLightSpot(x, y);
                    
                    // 添加按钮光效
                    const adjacentButtons = getAdjacentButtons(button);
                    addButtonGlow(button, adjacentButtons);
                    
                    // 添加点击反馈
                    button.style.transform = 'translateY(1px) scale(0.98)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    const value = button.textContent;
                    
                    // 处理数字输入
                    if (button.classList.contains('btn-number')) {
                        if (currentInput === '0' || resetScreen) {
                            currentInput = value;
                            resetScreen = false;
                        } else {
                            currentInput += value;
                        }
                        updateDisplay();
                    }
                    
                    // 处理操作符
                    if (button.classList.contains('btn-operator') && !button.classList.contains('btn-clear')) {
                        if (value === '⌫') {
                            // 删除最后一个字符
                            if (currentInput.length > 1) {
                                currentInput = currentInput.slice(0, -1);
                            } else {
                                currentInput = '0';
                            }
                            updateDisplay();
                            return;
                        }
                        
                        if (value === '%') {
                            // 百分比计算
                            currentInput = (parseFloat(currentInput) / 100).toString();
                            updateDisplay();
                            return;
                        }
                        
                        // 其他运算符
                        previousInput = currentInput;
                        operation = value;
                        resetScreen = true;
                    }
                    
                    // 处理清除按钮
                    if (button.classList.contains('btn-clear')) {
                        currentInput = '0';
                        previousInput = '';
                        operation = null;
                        updateDisplay();
                    }
                    
                    // 处理等号
                    if (button.classList.contains('btn-equals')) {
                        if (operation && previousInput) {
                            calculate();
                        }
                    }
                });
            });
            
            // 执行计算
            function calculate() {
                let prev = parseFloat(previousInput);
                let current = parseFloat(currentInput);
                let result;
                
                switch (operation) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '×':
                        result = prev * current;
                        break;
                    case '÷':
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                
                currentInput = result.toString();
                operation = null;
                previousInput = '';
                updateDisplay();
            }
            
            // 更多选项点击事件
            moreOptions.addEventListener('click', function(e) {
                e.stopPropagation();
                colorPanel.classList.add('show');
                overlay.classList.add('show');
            });
            
            // 关闭颜色面板
            closePanel.addEventListener('click', function() {
                colorPanel.classList.remove('show');
                overlay.classList.remove('show');
            });
            
            // 点击遮罩层关闭颜色面板
            overlay.addEventListener('click', function() {
                colorPanel.classList.remove('show');
                overlay.classList.remove('show');
            });
            
            // 颜色选择事件
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    glowColor = this.getAttribute('data-color');
                    colorPanel.classList.remove('show');
                    overlay.classList.remove('show');
                    
                    // 添加确认提示
                    const prevDisplay = display.textContent;
                    display.textContent = '光效已更改';
                    setTimeout(() => {
                        display.textContent = prevDisplay;
                    }, 1000);
                });
            });
            
            // 初始显示
            updateDisplay();
        });