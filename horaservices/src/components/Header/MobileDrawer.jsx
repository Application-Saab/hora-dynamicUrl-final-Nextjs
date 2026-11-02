import Link from "next/link";
import { MOBILE_DRAWER_MENU } from "@/utils/mobileDrawerMenu";
import { trackMetaCustomEvent } from "@/utils/fpixel";

const MobileDrawer = ({
  drawerRef,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout
}) => {
  const handleMetaTracking = () => {
    const params = {
      popup_name: "mobile_drawer",
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    }
    trackMetaCustomEvent("header_login_button_click", params)
  }
  return (
    <div ref={drawerRef} className="mobile-drawer">
      <div className="drawer-header">Welcome to Hora</div>

      <div style={{ padding: "0px 10px 20px 20px" }}>
        {MOBILE_DRAWER_MENU.map((item, index) => {
          
          // 🔗 Normal links
          if (item.type === "link") {
            return (
              <Link
                key={index}
                href={item.href}
                onClick={onClose}
                className="list"
              >
                {item.label}
              </Link>
            );
          }

          // 🔐 Login (only if NOT logged in)
          if (item.type === "login" && !isLoggedIn) {
            return (
              <button
                key={index}
                className="list drawer-btn"
                onClick={() => {
                  handleMetaTracking();
                  onClose();
                  onLogin();
                }}
              >
                {item.label}
              </button>
            );
          }

          // 🔓 Logout (only if logged in)
          if (item.type === "logout" && isLoggedIn) {
            return (
              <button
                key={index}
                className="list drawer-btn"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                {item.label}
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default MobileDrawer;
