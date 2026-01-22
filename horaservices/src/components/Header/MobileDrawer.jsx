import Link from "next/link";

const MobileDrawer = ({ drawerRef, onClose, onLogin, onLogout, isLoggedIn }) => {
  return (
    <div ref={drawerRef} className="mobile-drawer">
      <div className="drawer-header">Welcome to Hora</div>
      <div style={{padding: "0px 10px 20px 20px"}}>
      <Link href="/orderlist" onClick={onClose} className="list">My Orders</Link>
      <Link href="/balloon-decoration" onClick={onClose} className="list">Decoration</Link>
      <Link href="/photography-page" onClick={onClose} className="list">Photography</Link>
      <Link href="/book-chef-cook-for-party" onClick={onClose} className="list">Chef for Party</Link>
      <Link href="/party-food-delivery-live-catering-buffet/party-food-delivery" onClick={onClose} className="list">Food Delivery</Link>
      <Link href="/party-food-delivery-live-catering-buffet/party-live-buffet-catering" onClick={onClose} className="list">Live Catering</Link>
      <Link href="/aboutus" onClick={onClose} className="list">About Us</Link>
      <Link href="/contactus" onClick={onClose} className="list">Contact Us</Link>

      {!isLoggedIn ? (
        <button onClick={() => { onClose(); onLogin(); }}>Login</button>
      ) : (
        <button onClick={() => { onClose(); onLogout(); }}>Logout</button>
      )}
      </div>
    </div>
  );
};

export default MobileDrawer;
