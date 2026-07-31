import Image from "next/image";
import "./whyHoraSection.css";
import ExpertsDecoration from "@/assets/ExpertsDecoration.png";
import SecureTransactions from "@/assets/SecureTransactions.png";
import ServiceGuarantee from "@/assets/ServiceGuarantee.png";
const WhyHoraSection = () => {

  return (
   <div className="decorke-why-section">
              <h2 className="decorke-why-title">Why Hora Decoration</h2>

              <div className="decorke-why-features">
                <div className="decorke-why-item">
                  <Image src={ExpertsDecoration} alt="Experts Decoration" className="decorke-why-icon" />
                  <p className="decorke-why-text">EXPERTS<br />DECORATION</p>
                </div>
                <div className="decorke-why-item">
                  <Image src={SecureTransactions} alt="Secure Transactions" className="decorke-why-icon" />
                  <p className="decorke-why-text">SECURE<br />TRANSACTIONS</p>
                </div>
                <div className="decorke-why-item">
                  <Image src={ServiceGuarantee} alt="Service Guarantee" className="decorke-why-icon" />
                  <p className="decorke-why-text">100% SERVICE<br />GUARANTEED</p>
                </div>
              </div>
            </div>
  );
};

export default WhyHoraSection;