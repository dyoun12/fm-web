import { BusinessExplorer } from "./business-explorer";

export default {
  title: "Organisms/BusinessExplorer",
  component: BusinessExplorer,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    items: [
      {
        key: "platform",
        title: "플랫폼 개발",
        summary: "UX 중심 설계 + 클라우드 네이티브",
        content: (
          <div>
            <p>맞춤형 플랫폼 설계·구축 및 시스템 통합.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Web/App, SSO, API, 인증, CMS</li>
              <li>클라우드 아키텍처, 데이터 관리</li>
            </ul>
          </div>
        ),
      },
      {
        key: "investment",
        title: "투자 및 사업 육성",
        summary: "성과 창출형 투자 구조",
        content: (
          <div>
            <p>기술 스타트업/프로젝트에 전략적 투자.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>공동 개발, R&D 지원, IP 사업화</li>
            </ul>
          </div>
        ),
      },
      {
        key: "public",
        title: "공공 및 사회혁신",
        summary: "기술로 사회적 가치 확산",
        content: (
          <div>
            <p>공공데이터 플랫폼과 행정정보 통합.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>디지털화/자동화/시각화 기반 혁신</li>
            </ul>
          </div>
        ),
      },
    ],
  },
};

