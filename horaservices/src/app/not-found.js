import Link from "next/link";
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {" "}
      <h1>404 - Page Not Found</h1> <p>Sorry, this page does not exist.</p>{" "}
      <Link href="/">Go to Home</Link>{" "}
    </main>
  );
}
