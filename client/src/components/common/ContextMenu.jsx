import React, { useRef, useEffect } from "react";

function ContextMenu({ options, coordinates, contextMenu, setContexMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (event.target.id !== "context-opener") {
        //checking if the click is outside of the context Menu then we are closing the context menu
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target)
        ) {
          setContexMenu(false);
        }
      }
    };
    document.addEventListener("click", handleOutSideClick);

    return () => {
      document.removeEventListener("click", handleOutSideClick);
    };
  }, []);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContexMenu(false);
    callback();
  };

  return (
    <div
      className={`bg-dropdown-background fixed py-2 shadow-xl rounded-md`}
      ref={contextMenuRef}
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      <ul className="px-5 py-2 cursor-pointer hover:bg-background-default-hover">
        {options.map(({ name, callback }) => (
          <li key={name} onClick={(e) => handleClick(e, callback)}>
            <span className="text-white  hover:text-cyan-500 py-1">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
