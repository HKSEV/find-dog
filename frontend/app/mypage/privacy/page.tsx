import PolicyDocument from "../PolicyDocument";
import { privacySections } from "../policyTexts";

// 💡 마이 > 이용안내 > 개인정보처리방침
export default function PrivacyPage() {
  return <PolicyDocument title="개인정보처리방침" lead="어서찾아주개가 어떤 개인정보를 왜 모으고 어떻게 지키는지 알려 드려요." sections={privacySections}/>;
};
