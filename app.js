document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const convertBtn = document.getElementById('convertBtn');
    const outputText = document.getElementById('outputText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const copyBtn = document.getElementById('copyBtn');
    const toneSelect = document.getElementById('toneSelect');
    const langSelect = document.getElementById('langSelect');

    // 履歴・区分けUI
    const saveBtn = document.getElementById('saveBtn');
    const categoryInput = document.getElementById('categoryInput');
    const historyFilter = document.getElementById('historyFilter');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyGrid = document.getElementById('historyGrid');

    // 履歴データのロード
    let historyData = JSON.parse(localStorage.getItem('kensakuHistory')) || [];
    renderHistory();

    // 文字数カウント機能
    inputText.addEventListener('input', () => {
        const length = inputText.value.length;
        charCount.textContent = `${length}文字`;
    });

    // モックアップ用データ：実際のAPIの代わりに返すレスポンス
    const mockResponses = {
        ja: {
            keigo: "入力された文章を、より丁寧な敬語表現に修正いたしました。ビジネスシーンでも安心してご利用いただけます。",
            kenjougo: "いただいた文章を、相手を敬い自身をへりくだる謙譲表現へと変換させていただきました。",
            tamego: "入力された文章を、友達同士で話すようなカジュアルなタメ語にしてみたよ！",
            business: "本件につきまして、ビジネスメールに適した形式へ変換いたしました。ご確認のほどよろしくお願い申し上げます。",
            poetic: "紡がれた言葉たちは、月明かりのように優しく、詩的な響きを帯びて生まれ変わりました。"
        },
        en: {
            keigo: "I have revised the input text into a more polite expression. You can confidently use this in professional settings.",
            kenjougo: "I have humbly translated the text to express deep respect towards the recipient.",
            tamego: "Hey! I changed your text into a super casual tone, perfect for chatting with friends!",
            business: "Regarding this matter, the text has been converted into a standard business format. Please kindly review.",
            poetic: "The woven words have been reborn, carrying a poetic resonance as gentle as moonlight."
        },
        zh: {
            keigo: "我们已将您输入的文本修改为更礼貌的表达方式。您可以放心地在商务场合使用。",
            kenjougo: "我们以谦卑的方式翻译了该文本，以表达对收件人的深切敬意。",
            tamego: "嗨！我把你的话变成了超随意的语气，很适合和朋友聊天哦！",
            business: "关于此事，文本已转换为标准商务格式。请您查阅。",
            poetic: "交织的文字重获新生，带着如月光般温柔的诗意共鸣。"
        },
        ko: {
            keigo: "입력하신 문장을 정중한 표현으로 수정하였습니다. 비즈니스 상황에서도 안심하고 사용하실 수 있습니다.",
            kenjougo: "상대방을 존중하고 자신을 낮추는 겸양 표현으로 변환해 드렸습니다.",
            tamego: "입력한 문장을 친구끼리 말하는 것처럼 캐주얼한 반말로 바꿔봤어!",
            business: "본 건에 대하여 비즈니스 메일에 적합한 형식으로 변환하였습니다. 확인 부탁드립니다.",
            poetic: "자아낸 언어들은 달빛처럼 부드럽고 시적인 울림을 띠며 다시 태어났습니다."
        }
    };

    // 変換処理のシミュレーション
    convertBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) {
            alert('変換したい文章を入力してください。');
            inputText.focus();
            return;
        }

        const tone = toneSelect.value;
        const lang = langSelect.value;

        // UI状態の更新
        convertBtn.disabled = true;
        saveBtn.disabled = true;
        outputText.classList.remove('placeholder');
        outputText.textContent = '';
        loadingIndicator.classList.remove('hidden');

        // ※本来はここでOpenAIやGeminiなどのAPIをFetchします。
        // 例: const response = await fetch('https://api.openai.com/v1/chat/completions', { ... });
        
        // デモ用：通信遅延のシミュレート (1.5秒〜2.5秒)
        const delay = Math.floor(Math.random() * 1000) + 1500;
        await new Promise(resolve => setTimeout(resolve, delay));

        // モックから結果を取得、または汎用の返答を生成
        let resultText = "";
        
        if (text.length > 20) {
            // 長い文章の場合は、モックの先頭につなげて返す（デモらしく見せるため）
            resultText = mockResponses[lang][tone] + "\n\n【変換された元の文章のプレビュー】\n" + text.substring(0, 50) + "...";
        } else {
            resultText = mockResponses[lang][tone];
        }

        // タイプライターアニメーションで結果を表示
        loadingIndicator.classList.add('hidden');
        typeWriter(resultText, outputText);
    });

    // タイプライターエフェクト関数
    async function typeWriter(text, element) {
        element.textContent = '';
        const chars = text.split('');
        for (let i = 0; i < chars.length; i++) {
            element.textContent += chars[i];
            // 文字間にわずかなランダムな遅延を入れる
            await new Promise(r => setTimeout(r, Math.floor(Math.random() * 20) + 10));
        }
        convertBtn.disabled = false;
        saveBtn.disabled = false;
    }

    // コピー機能
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputText.textContent;
        if (!textToCopy || outputText.classList.contains('placeholder')) {
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            // コピー成功時のアイコンアニメーション
            const icon = copyBtn.querySelector('i');
            icon.classList.remove('fa-copy', 'fa-regular');
            icon.classList.add('fa-check', 'fa-solid');
            icon.style.color = '#10b981'; // 成功色（緑）

            setTimeout(() => {
                icon.classList.remove('fa-check', 'fa-solid');
                icon.classList.add('fa-copy', 'fa-regular');
                icon.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('クリップボードへのコピーに失敗しました', err);
            alert('コピーに失敗しました。');
        });
    });

    // 履歴・区分け機能の実装
    saveBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        const result = outputText.textContent.trim();
        if (!text || !result || outputText.classList.contains('placeholder')) return;

        const category = categoryInput.value.trim() || '未分類';
        const tone = toneSelect.options[toneSelect.selectedIndex].text;
        const lang = langSelect.options[langSelect.selectedIndex].text;

        const historyItem = {
            id: Date.now().toString(),
            original: text,
            converted: result,
            tone: tone,
            lang: lang,
            category: category,
            date: new Date().toLocaleString('ja-JP')
        };

        historyData.unshift(historyItem);
        localStorage.setItem('kensakuHistory', JSON.stringify(historyData));
        
        // 保存成功のエフェクト
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> 保存しました';
        saveBtn.style.color = '#10b981';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.color = '';
        }, 2000);

        renderHistory();
    });

    historyFilter.addEventListener('change', () => {
        renderHistory();
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('すべての履歴を削除しますか？')) {
            historyData = [];
            localStorage.removeItem('kensakuHistory');
            renderHistory();
        }
    });

    // 履歴の描画とフィルタリング
    function renderHistory() {
        if (historyData.length === 0) {
            historyGrid.innerHTML = '<div class="history-empty" style="color: var(--text-muted); text-align: center; padding: 2rem;">保存された履歴はありません。</div>';
            updateFilterOptions();
            return;
        }

        const selectedCategory = historyFilter.value;
        const filteredData = selectedCategory === 'all' 
            ? historyData 
            : historyData.filter(item => item.category === selectedCategory);

        if (filteredData.length === 0) {
            historyGrid.innerHTML = '<div class="history-empty" style="color: var(--text-muted); text-align: center; padding: 2rem;">該当する履歴はありません。</div>';
        } else {
            historyGrid.innerHTML = filteredData.map(item => `
                <div class="history-card">
                    <div class="history-card-header">
                        <span class="history-tag">${escapeHtml(item.category)}</span>
                        <span class="history-meta">${item.date}</span>
                    </div>
                    <div class="history-meta" style="margin-bottom: 0.5rem;">
                        <i class="fa-solid fa-sliders"></i> ${item.tone} / ${item.lang}
                    </div>
                    <div class="history-text-preview" title="元のテキスト:\n${escapeHtml(item.original)}">
                        ${escapeHtml(item.converted)}
                    </div>
                    <div class="history-actions">
                        <button class="icon-btn delete-item-btn" data-id="${item.id}" title="削除">
                            <i class="fa-solid fa-trash-can" style="font-size: 0.9rem;"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            // 個別削除ボタンのイベント追加
            document.querySelectorAll('.delete-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    historyData = historyData.filter(item => item.id !== id);
                    localStorage.setItem('kensakuHistory', JSON.stringify(historyData));
                    renderHistory();
                });
            });
        }

        updateFilterOptions();
    }

    function updateFilterOptions() {
        const categories = [...new Set(historyData.map(item => item.category))];
        const currentValue = historyFilter.value;
        
        let optionsHtml = '<option value="all">すべての区分</option>';
        categories.forEach(cat => {
            optionsHtml += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
        });
        
        historyFilter.innerHTML = optionsHtml;
        if (categories.includes(currentValue) || currentValue === 'all') {
            historyFilter.value = currentValue;
        }
    }

    // XSS対策
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
});
