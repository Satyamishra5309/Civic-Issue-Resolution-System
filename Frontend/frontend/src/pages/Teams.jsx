import { useEffect, useState } from "react";
import { getTeams } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTeams();
        setTeams(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";

      case "Busy":
        return "bg-orange-100 text-orange-600";

      case "Offline":
        return "bg-red-100 text-red-600";

      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <MainLayout>

      <div className="p-6">

        {/* 🔥 Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              👨‍🔧 Teams Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage and monitor all assigned field teams
            </p>
          </div>

          {/* Stats */}
          <div className="hidden md:flex gap-4">

            <div className="bg-white shadow-lg rounded-2xl px-6 py-4 border">
              <p className="text-gray-500 text-sm">
                Total Teams
              </p>

              <h2 className="text-3xl font-bold text-blue-600">
                {teams.length}
              </h2>
            </div>

            <div className="bg-white shadow-lg rounded-2xl px-6 py-4 border">
              <p className="text-gray-500 text-sm">
                Active Teams
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                {
                  teams.filter((t) => t.status === "Active").length
                }
              </h2>
            </div>

          </div>
        </div>

        {/* 🔥 Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {teams.map((t, index) => (

            <div
              key={t._id}
              className="
                group
                bg-white
                rounded-3xl
                border
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-2
                overflow-hidden
              "
            >

              {/* Top Gradient */}
              <div
                className="
                  h-2
                  bg-gradient-to-r
                  from-blue-500
                  via-purple-500
                  to-pink-500
                "
              />

              <div className="p-6">

                {/* Team Icon */}
                <div className="flex items-center justify-between mb-5">

                  <div className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-500
                    to-purple-600
                    flex
                    items-center
                    justify-center
                    text-white
                    text-2xl
                    shadow-lg
                  ">
                    👨‍🔧
                  </div>

                  <span
                    className={`
                      px-4 py-2 rounded-full text-sm font-semibold
                      ${getStatusStyle(t.status)}
                    `}
                  >
                    {t.status}
                  </span>

                </div>

                {/* Team Name */}
                <h2 className="
                  text-2xl
                  font-bold
                  text-gray-800
                  mb-2
                  group-hover:text-blue-600
                  transition
                ">
                  {t.name}
                </h2>

                {/* Members */}
                <div className="space-y-4 mt-6">

                  <div className="
                    flex
                    items-center
                    justify-between
                    bg-gray-50
                    rounded-2xl
                    px-4
                    py-3
                  ">

                    <div>
                      <p className="text-gray-500 text-sm">
                        Members
                      </p>

                      <h3 className="font-bold text-lg text-gray-800">
                        {t.members}
                      </h3>
                    </div>

                    <div className="
                      text-3xl
                      bg-blue-100
                      w-12
                      h-12
                      rounded-xl
                      flex
                      items-center
                      justify-center
                    ">
                      👥
                    </div>

                  </div>

                  {/* Performance */}
                  <div className="
                    bg-gradient-to-r
                    from-gray-50
                    to-gray-100
                    rounded-2xl
                    p-4
                  ">

                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-500">
                        Efficiency
                      </p>

                      <p className="text-sm font-semibold text-gray-700">
                        {70 + index * 5}%
                      </p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-green-400
                          to-blue-500
                        "
                        style={{
                          width: `${70 + index * 5}%`,
                        }}
                      />
                    </div>

                  </div>

                </div>

                {/* Footer */}
                <div className="
                  mt-6
                  pt-4
                  border-t
                  flex
                  items-center
                  justify-between
                ">

                  <p className="text-sm text-gray-400">
                    Team #{index + 1}
                  </p>

<button
  onClick={() => navigate(`/teams/${t._id}`)}
  className="
    bg-blue-500
    hover:bg-blue-600
    text-white
    px-4
    py-2
    rounded-xl
    font-medium
    transition
  "
>
  View Details
</button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Empty State */}
        {teams.length === 0 && (
          <div className="
            bg-white
            rounded-3xl
            shadow-lg
            p-16
            text-center
            mt-10
          ">

            <div className="text-7xl mb-4">
              👨‍🔧
            </div>

            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Teams Found
            </h2>

            <p className="text-gray-500">
              Teams will appear here once created
            </p>

          </div>
        )}

      </div>

    </MainLayout>
  );
};

export default Teams;