import React, { useEffect, useState, useCallback } from "react";
import TableRow from "../components/TableRow";

import { AuthContext } from "../authContext";

const AdminDashboardPage = () => {
  const { dispatch } = React.useContext(AuthContext);

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://reacttask.mkdlabs.com/v1/api/rest/video/PAGINATE",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-project":
                "cmVhY3R0YXNrOmQ5aGVkeWN5djZwN3p3OHhpMzR0OWJtdHNqc2lneTV0Nw==",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              payload: {},
              page: page,
              limit: 10,
            }),
          }
        );

        const data = await response.json();
        setVideos(data.list);
        setTotalPages(data.num_pages);
        const initialOrder = data.list.map((video) => video.id);
        setOrder(initialOrder);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleRowReorder = useCallback((dragIndex, hoverIndex) => {
    setOrder((prevOrder) =>
      update(prevOrder, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevOrder[dragIndex]],
        ],
      })
    );
  }, []);

  return (
    <>
      <div className="w-full bg-black h-full text-gray-700 px-24 py-6">
        <div className="flex justify-between items-center pb-24">
          <p className="text-white font-bold text-3xl">APP</p>
          <button
            className="bg-[#9BFF00] text-black px-5 py-1  font-light rounded-2xl cursor-pointer"
            onClick={() => dispatch({ type: "LOGOUT" })}>
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mb-12">
          <p className=" text-gray-400 text-4xl">Today's leaderboad</p>
          <div className="bg-[#1d1d1d] px-4 py-2 flex items-center justify-center text-gray-300 font-light gap-2 rounded-xl text-sm">
            <span>30 may 2022</span> <span>&bull;</span>
            <span className="bg-[#9BFF00] px-3 rounded-lg text-gray-600 uppercase">
              submission open
            </span>
            <span>&bull;</span> <span>11:34</span>
          </div>
        </div>

        <table className="w-full text-gray-300 font-light">
          <thead>
            <tr className="flex gap-7 items-start text-start">
              <th>#</th>
              <th className="w-[60%] text-start">Title</th>
              <th className="w-[30%] text-start">Author</th>
              <th className="w-[10%] ">Most liked</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 mt-5">
            {order.map((videoId, index) => {
              const video = videos.find((v) => v.id === videoId);

              return (
                <TableRow
                  key={video.id}
                  video={video}
                  index={index}
                  handleRowReorder={handleRowReorder}
                />
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-10 mt-10">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-[#9BFF00] px-3 py-2 rounded-lg text-gray-600 hover:opacity-60  disabled:bg-transparent disabled:border disabled:border-[#9BFF00] disabled:cursor-not-allowed">
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="bg-[#9BFF00] px-3 py-2 rounded-lg text-gray-600 hover:opacity-60 disabled:bg-transparent disabled:border disabled:border-[#9BFF00] disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
