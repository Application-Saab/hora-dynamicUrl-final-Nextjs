const DecorationDetailsSkeletonPage = () => {
    return (
        <div className="skeleton-loader" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "20px", paddingBottom: "20px", position: "relative" }} className="decDetails">
                <div style={{ width: "50%", textAlign: "center" }} className="decDetailsLeft">
                    <div style={{ width: "80%", height: "300px", backgroundColor: "#f0f0f0", margin: "0 auto", position: "relative" }} />
                </div>
                <div style={{ width: "50%", paddingLeft: "20px", paddingRight: "50px" }} className="decDetailsRight">
                    <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "30px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "40%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "80%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "30px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "20px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "60%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "100%", borderRadius: "4px" }} className="decDetailsRightInner" />
                    <div style={{ height: "50px", backgroundColor: "#f0f0f0", marginBottom: "12px", width: "100%", borderRadius: "4px" }} className="decDetailsRightInner" />
                </div>
            </div>
        </div>
    );
}

export default DecorationDetailsSkeletonPage;