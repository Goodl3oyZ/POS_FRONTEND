/api/auth/login: สำหรับ login
/api/auth/logout: สำหรับ logout
/api/auth/session: สำหรับเช็ค session ปัจจุบัน


ใช้ useAuth hook ในคอมโพเนนต์ที่ต้องการเช็ค auth state:
import { useAuth } from "@/lib/auth-context";

export default function ProtectedComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login("username", "password")}>Login</button>
      )}
    </div>
  );
}