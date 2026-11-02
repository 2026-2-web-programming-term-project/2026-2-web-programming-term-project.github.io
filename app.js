"use strict";

const screens = [
  { id: "C01", title: "로그인", group: "common", description: "이메일 인증과 활성 상태를 확인한 뒤 역할별 첫 화면으로 이동합니다. 실패 문구는 공통으로 제공하고 이메일 입력을 유지합니다." },
  { id: "C02", title: "회원가입", group: "common", description: "이름·이메일·비밀번호와 연구실 초대 코드를 확인합니다. 가입자는 일반 사용자로 생성하며 관리자 권한 선택 입력은 제공하지 않습니다." },
  { id: "C03", title: "이메일 인증", group: "common", description: "인증 번호 입력·유효 시간·재발송·인증 완료 상태를 제공합니다. 재발송하면 이전 번호를 무효화합니다. 인증 정책 수치는 제안값입니다." },
  { id: "U01", title: "자원 모니터링 대시보드", group: "user", description: "소속 연구실 자원의 실제 상태와 마지막 갱신 시각을 확인하고 예약 화면으로 이동합니다. 연결이 끊긴 자원을 유휴 상태로 표시하지 않습니다." },
  { id: "U02", title: "자원 상세와 대기 알림", group: "user", description: "GPU 사양·실제 상태·예약 일정을 확인합니다. 조기 종료 대기 알림을 신청하거나 해제할 수 있으며 자동 예약이나 우선권을 보장하지 않습니다." },
  { id: "U03", title: "자원 예약 캘린더", group: "user", description: "자원과 주간 날짜 범위를 선택하고 빈 미래 시간에서 예약을 시작합니다. 다른 사람의 예약은 점유 시간만 표시하며 저장 시 중복을 다시 검사합니다." },
  { id: "U04", title: "예약 등록과 수정", group: "user", description: "시간·목적을 입력하고 예약 단위·최대 연속 점유·중복을 검증합니다. 수정은 본인의 시작 전 예약만 허용하며 오류 시 입력을 유지합니다." },
  { id: "U05", title: "예약 상세와 처리 결과", group: "user", description: "예약 상태와 실제 GPU 상태를 별도로 표시합니다. 상태·권한에 따라 수정·취소·조기 종료 버튼을 제공하고 처리 결과를 확인합니다." },
  { id: "U06", title: "취소와 조기 종료 확인", group: "user", description: "처리 대상과 영향을 다시 확인합니다. 관리자 운영 취소는 사유가 필요하며, 요청 시 권한과 최신 상태를 재검증합니다. GPU 프로세스를 강제로 중지하지 않습니다." },
  { id: "U07", title: "마이페이지와 예약 이력", group: "user", description: "본인 예약을 기간·상태로 조회합니다. 예약 시간 합계에서 취소는 제외하고 조기 종료를 반영하며 실제 GPU 실행 시간과 구분합니다." },
  { id: "U08", title: "실시간 알림함", group: "user", description: "예약 임박·조기 종료·운영 취소 알림을 조회하고 읽음 처리합니다. 실시간 연결 복구 후 누락된 알림을 다시 조회합니다." },
  { id: "O01", title: "운영 현황과 예약 관리", group: "admin", description: "소속 연구실의 자원 상태와 전체 예약을 조회합니다. 관리자는 사유를 남겨 운영 취소할 수 있으며 실제 GPU 사용 상태를 임의로 유휴로 바꾸지 않습니다." },
  { id: "O02", title: "자원 등록과 수정", group: "admin", description: "자원명·고유 식별자·GPU 사양·점검 상태를 관리합니다. 점검은 신규 예약을 제한하며 기존 예약은 운영 화면에서 별도로 처리합니다." },
  { id: "A01", title: "회원과 연구실 초대 코드", group: "admin", description: "회원 역할·이용 상태와 초대 코드를 관리합니다. 마지막 관리자 강등·자기 이용 제한은 막고 코드 재발급 시 기존 코드를 무효화합니다." },
  { id: "A02", title: "예약 정책 설정", group: "admin", description: "예약 단위·최대 연속 시간·임박 알림 기준을 검증합니다. 변경은 새 예약과 수정에 적용하며 기존 확정 예약을 자동 변경하지 않습니다." },
  { id: "A03", title: "전체 예약 사용 통계", group: "admin", description: "기간·자원별 예약 시간과 회원별 요약을 제공합니다. 취소·조기 종료·기간 경계·점검 시간을 반영하고 실제 GPU 연산 부하와 구분합니다." },
  { id: "M01", title: "모바일 자원 대시보드", group: "mobile", description: "U01의 반응형 화면입니다. 자원 표를 카드 목록으로 바꾸고 갱신 시각·상태 토글·예약 접근을 좁은 화면에 배치합니다." },
  { id: "M02", title: "모바일 예약 등록과 수정", group: "mobile", description: "U04와 같은 예약 기능·정책을 적용합니다. 입력은 한 열로 배치하고 상단 확정 버튼과 키보드·오류 초점·터치 영역을 고려합니다." }
];

const list = document.querySelector("#screen-list");
const filters = [...document.querySelectorAll("[data-filter]")];
const preview = document.querySelector("#screen-image");
const dialog = document.querySelector("#screen-dialog");
let selectedId = "U01";
let selectedFilter = "all";

function visibleScreens() {
  return screens.filter(screen => selectedFilter === "all" || screen.group === selectedFilter);
}

function renderScreens() {
  const visible = visibleScreens();
  const selected = visible.find(screen => screen.id === selectedId) || visible[0];
  selectedId = selected.id;
  list.replaceChildren(...visible.map(screen => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "screen-select" + (screen.id === selectedId ? " active" : "");
    button.setAttribute("aria-pressed", String(screen.id === selectedId));
    button.dataset.screen = screen.id;
    const code = document.createElement("span");
    const title = document.createElement("b");
    code.textContent = screen.id;
    title.textContent = screen.title;
    button.append(code, title);
    button.addEventListener("click", () => {
      selectedId = screen.id;
      renderScreens();
      list.querySelector(`[data-screen="${selectedId}"]`).focus({ preventScroll: true });
    });
    return button;
  }));
  document.querySelector("#screen-code").textContent = selected.id;
  document.querySelector("#screen-title").textContent = selected.title;
  document.querySelector("#screen-description").textContent = selected.description;
  preview.src = `assets/ui/${selected.id}.png`;
  preview.alt = `${selected.id} ${selected.title} 와이어프레임 · 예시 데이터`;
  preview.height = selected.group === "mobile" ? 850 : 760;
  const index = visible.findIndex(screen => screen.id === selectedId);
  document.querySelector("#screen-position").textContent = `${String(index + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")} SCREENS`;
  document.querySelector("#previous-screen").disabled = index === 0;
  document.querySelector("#next-screen").disabled = index === visible.length - 1;
}

filters.forEach(button => button.addEventListener("click", () => {
  selectedFilter = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  renderScreens();
}));

function stepScreen(direction) {
  const visible = visibleScreens();
  const index = visible.findIndex(screen => screen.id === selectedId);
  const next = visible[index + direction];
  if (next) {
    selectedId = next.id;
    renderScreens();
  }
}
document.querySelector("#previous-screen").addEventListener("click", () => stepScreen(-1));
document.querySelector("#next-screen").addEventListener("click", () => stepScreen(1));

document.querySelector("#zoom-screen").addEventListener("click", () => {
  const selected = screens.find(screen => screen.id === selectedId);
  const enlarged = document.querySelector("#dialog-image");
  enlarged.src = preview.src;
  enlarged.alt = preview.alt;
  enlarged.height = preview.height;
  document.querySelector("#dialog-title").textContent = `${selected.id} · ${selected.title}`;
  dialog.showModal();
});
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

const sectionLinks = [...document.querySelectorAll(".sidebar nav a")];
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  if (!visible.length) return;
  const activeId = visible[0].target.id;
  sectionLinks.forEach(link => {
    if (link.hash === `#${activeId}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
renderScreens();
