const AdminHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "15px", background: "#111", color: "#fff" }}>
      <h2>Admin Panel</h2>
      <p>{user?.email}</p>
    </div>
  );
};

export default AdminHeader;
