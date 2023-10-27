import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Drawer } from "antd";
import { AiOutlineClose } from "react-icons/ai";
import { FiEdit, FiEdit3, FiLogOut } from "react-icons/fi";
import EditDrawer from "./EditDrawer";

interface IDrawerComponent {
  isActiveDrawer: boolean;
  closeDrawer: () => void;
}

function DrawerComponent({ isActiveDrawer, closeDrawer }: IDrawerComponent) {
  const [isActiveEdit, setIsActiveEdit] = React.useState<boolean>(false);
  const [flag, setFlag] = React.useState(false);
  const { auth, setAuth, logout } = useAuth();

  React.useEffect(() => {
    if (!isActiveEdit)
      setTimeout(() => {
        setFlag(!flag);
      }, 500);
  }, [isActiveEdit]);

  return (
    <>
      <Drawer
        placement={"left"}
        closable={false}
        onClose={closeDrawer}
        open={isActiveDrawer}
        key={"left"}
        bodyStyle={{
          backgroundColor: "rgba(25 25 25)",
          borderRight: "1px solid rgba(255, 255, 255, 20%)",
          padding: 0,
          // fontFamily: '"Euclid Circular A","Arial",sans-serif',
        }}
        width={isActiveEdit ? 180 : 300}
      >
        {flag ? (
          <EditDrawer
            closeEditDrawer={() => setIsActiveEdit(false)}
            isActiveEdit={isActiveEdit}
          />
        ) : null}

        <div className="flex border-t-0 border border-x-0 items-center border-b-gray-300 w-full  text-xl h-14 p-2 justify-between bg-opacity-50">
          <div
            className="flex items-center text-xl font-bold"
            style={{ textIndent: 10 }}
          >
            Chatiffy
          </div>
          <button
            onClick={closeDrawer}
            type="button"
            className="text-xl transition-colors hover:text-red-600"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className="flex flex-col items-center p-5 border-b-2 border-neutral-400">
          <img
            src={`uploads/${auth?.urlProfileImage}`}
            alt="user-img"
            className="rounded-xl h-40"
          />
          <div className="mt-2 text-lg">
            {auth?.firstName} {auth?.lastName}
          </div>
          <div className="text-neutral-500">{auth?.email}</div>
        </div>
        <div className="px-4 py-2 mt-1">
          <button
            type="button"
            className="w-full p-2 rounded-xl flex items-center text-base font-semibold gap-3 hover:bg-neutral-950 px-4"
            onClick={() => {
              setIsActiveEdit(true);
              setFlag(true);
            }}
          >
            <FiEdit3 className={"font-bold text-xl"} /> Edit profile
          </button>
          <button
            onClick={logout}
            className="w-full p-2 text-red-700 rounded-xl flex items-center text-base font-semibold gap-3 hover:bg-neutral-950 px-4"
          >
            <FiLogOut className={"font-bold text-xl"} />
            Logout
          </button>
        </div>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
