const $msgs = document.getElementById('cw-messages');
const $form = document.getElementById('cw-form');
const $input = document.getElementById('cw-input');
const $close = document.getElementById('cw-close');

// ① Đặt URL API backend của bạn ở đây (nếu đã có)
const BACKEND_URL = ""; 
// ví dụ: const BACKEND_URL = "https://your-backend.onrender.com/api/chat";

function addRow(role, html) {
  const row = document.createElement('div');
  row.className = `cw-row ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'cw-bubble';
  bubble.innerHTML = html;
  row.appendChild(bubble);
  $msgs.appendChild(row);
  $msgs.scrollTop = $msgs.scrollHeight;
  return bubble;
}

function addTyping() {
  return addRow('bot', `<div class="cw-typing"><span></span><span></span><span></span></div>`);
}

function esc(s=''){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function nl2br(s=''){ return s.replace(/\n/g,'<br>'); }

async function send(msg) {
  addRow('user', esc(msg));
  const typing = addTyping();

  try {
    if (BACKEND_URL) {
      // Gọi backend thật
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      typing.innerHTML = nl2br(esc(data.reply || ''));
    } else {
      // DEMO: chưa có backend thì trả lời giả lập
      await new Promise(r => setTimeout(r, 600));
      typing.innerHTML = nl2br(esc(`(Demo) Bạn hỏi: "${msg}"\nMình cần BACKEND_URL để trả lời bằng GenAI nhé!`));
    }
  } catch (e) {
    typing.textContent = 'Có lỗi kết nối. Vui lòng thử lại.';
  }
}

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $input.value.trim();
  if (!q) return;
  $input.value = '';
  send(q);
});

// nút đóng: gửi tín hiệu cho trang mẹ (Ladipage) để ẩn iframe nếu cần
$close?.addEventListener('click', () => {
  if (window.top !== window) window.parent.postMessage({ type: 'cw-close' }, '*');
});

// Lời chào ban đầu
addRow('bot', 'Xin chào 👋 Mình là trợ lý Vilaco. Bạn cần hỗ trợ gì hôm nay?');
