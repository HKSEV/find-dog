import PolicyDocument from "../PolicyDocument";
import { termsSections } from "../policyTexts";

// 💡 마이 > 이용안내 > 이용약관
export default function TermsPage() {
  return <PolicyDocument title="이용약관" lead="어서찾아주개를 이용할 때 지켜야 할 약속이에요." sections={termsSections}/>;
};
