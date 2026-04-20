import { useEffect, useState } from "react";
import { getTeams } from "../services/api";
import MainLayout from "../layouts/MainLayout";

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getTeams();
      setTeams(res.data);
    };
    fetch();
  }, []);

  return (
    <MainLayout>
    <div>
      <h2 className="text-xl mb-4">Teams</h2>

      {teams.map((t) => (
        <div key={t._id} className="p-4 bg-white shadow mb-2 rounded">
          <h3>{t.name}</h3>
          <p>Members: {t.members}</p>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
    </MainLayout>
  );
};

export default Teams;