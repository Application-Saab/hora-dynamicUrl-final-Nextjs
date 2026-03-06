import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>

      <p className="privacy-text">
        This privacy policy sets out how <strong>HORA SERVICES</strong> uses
        and protects any information that you give HORA SERVICES when you
        visit their website and/or agree to purchase from them.
      </p>

      <p className="privacy-text">
        HORA SERVICES is committed to ensuring that your privacy is protected.
        Should we ask you to provide certain information by which you can be
        identified when using this website, then you can be assured that it
        will only be used in accordance with this privacy statement.
      </p>

      <p className="privacy-text">
        HORA SERVICES may change this policy from time to time by updating
        this page. You should check this page from time to time to ensure
        that you adhere to these changes.
      </p>

      {/* Information We Collect */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">Information We May Collect</h2>

        <ul className="privacy-list">
          <li>Name</li>
          <li>Contact information including email address</li>
          <li>
            Demographic information such as postcode, preferences and
            interests (if required)
          </li>
          <li>Other information relevant to customer surveys and/or offers</li>
        </ul>
      </div>

      {/* What We Do */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">
          What We Do With The Information
        </h2>

        <ul className="privacy-list">
          <li>Internal record keeping</li>
          <li>Improve our products and services</li>
          <li>Send promotional emails about new products or offers</li>
          <li>Market research via email, phone, fax or mail</li>
          <li>Customize the website according to your interests</li>
        </ul>
      </div>

      {/* Security */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">Data Security</h2>

        <p className="privacy-text">
          We are committed to ensuring that your information is secure. In
          order to prevent unauthorised access or disclosure we have put
          suitable measures in place.
        </p>
      </div>

      {/* Cookies */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">How We Use Cookies</h2>

        <p className="privacy-text">
          A cookie is a small file placed on your device to help analyze web
          traffic and improve website experience.
        </p>

        <p className="privacy-text">
          We use traffic log cookies to identify which pages are being used.
          This helps us analyze webpage traffic and improve our website.
        </p>

        <p className="privacy-text">
          You can choose to accept or decline cookies through your browser
          settings.
        </p>
      </div>

      {/* Personal Info */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">
          Controlling Your Personal Information
        </h2>

        <p className="privacy-text">
          You may choose to restrict the collection or use of your personal
          information by selecting the appropriate option on website forms.
        </p>

        <p className="privacy-text">
          We will not sell, distribute or lease your personal information to
          third parties unless required by law or with your permission.
        </p>
      </div>

      {/* Correction */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">Correction of Information</h2>

        <p className="privacy-text">
          If you believe any information we are holding on you is incorrect
          or incomplete, please write to:
        </p>

        <p className="privacy-address">
          <strong>HORA SERVICES</strong>
          <br />
          B-27/295 Near Gidwani Park
          <br />
          Bhopal, Madhya Pradesh – 462030
          <br />
          India
        </p>
      </div>

      {/* Contact */}
      <div className="privacy-section">
        <h2 className="privacy-section-title">Contact & Support</h2>

        <p className="privacy-text">
          📧 Support Email: <strong>dev@horaservices.com</strong>
        </p>

        <p className="privacy-text">
          🌐 Website: https://horaservices.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;