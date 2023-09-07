import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

const TableRow = ({ video, index, handleRowReorder }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "row",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      handleRowReorder(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag(
    {
      type: "row",
      item: () => {
        return { id: video.id, index };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }[(video, index)]
  );

  drag(drop(ref));

  return (
    <tr
      className={`flex gap-7 items-center justify-center py-3 px-10 text-center border border-gray-400 rounded-lg text-gray-500 cursor-move ${
        isDragging && "opacity-50"
      }`}
      ref={ref}>
      <td>{video.id}</td>
      <td className="w-[60%] flex gap-3 justify-start items-center">
        <img
          src={video.photo}
          alt="video img"
          className="w-24 h-14 rounded-lg"
        />
        {video.title}
      </td>
      <td className="w-[30%] text-start text-[#9BFF00]">{video.username}</td>
      <td className="w-[10%] text-end">{video.like}</td>
    </tr>
  );
};

export default TableRow;
